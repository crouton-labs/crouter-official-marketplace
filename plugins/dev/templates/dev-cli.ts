// Zero-dependency command-tree framework for agent-facing CLIs — repository
// dev surfaces, plugin bin executables, or any standalone house-style tool.
// Run with Node >=26: node path/to/dev.ts …

type Primitive = string | number | boolean | null;
type JsonValue = Primitive | JsonValue[] | { [key: string]: JsonValue };
type InputValue = JsonValue | undefined;

export type Parameter = {
  kind: "flag" | "positional" | "stdin";
  name: string;
  type: "string" | "integer" | "boolean" | "enum" | "path" | "json";
  description: string;
  required?: boolean;
  repeatable?: boolean;
  default?: Primitive;
  values?: readonly string[];
  min?: number;
  max?: number;
  pattern?: RegExp;
  validate?: (value: InputValue, input: Readonly<Record<string, InputValue>>) => string | undefined;
  focused?: {
    whenToUse: string;
    value: string;
    effects?: string[];
    interactions?: string[];
    state?: () => StateBlock | Promise<StateBlock>;
  };
};

export type OutputField = {
  name: string;
  type: string;
  description: string;
};

export type RenderedResult = {
  attributes?: Record<string, Primitive>;
  body?: string;
};

export type RunContext = {
  argv: readonly string[];
  stdin: string | undefined;
  json: boolean;
};

export type StateBlock = {
  name: string;
  attributes?: Record<string, Primitive>;
  body?: string;
};

export type Leaf = {
  name: string;
  description: string;
  whenToUse: string;
  params?: Parameter[];
  output: OutputField[];
  effects: string[];
  result: {
    block: string;
    render: (value: unknown, input: Readonly<Record<string, InputValue>>) => RenderedResult;
  };
  stream?: boolean;
  run: (input: Readonly<Record<string, InputValue>>, context: RunContext) => unknown | Promise<unknown> | AsyncIterable<unknown>;
};

export type Branch = {
  name: string;
  description: string;
  whenToUse: string;
  model?: string;
  state?: () => StateBlock | Promise<StateBlock>;
  children: Command[];
};

export type Command = Branch | Leaf;

export type CliDefinition = {
  name: string;
  description: string;
  commands: Command[];
};

export class CommandError extends Error {
  code: string;
  field: string;
  received: string;
  expected: string;
  next: string;

  constructor({ code, message, field = "command", received, expected, next }: { code: string; message: string; field?: string; received: string; expected: string; next: string }) {
    super(message);
    this.code = code;
    this.field = field;
    this.received = received;
    this.expected = expected;
    this.next = next;
  }
}

export function defineCli(definition: CliDefinition) {
  return {
    async run(argv = process.argv.slice(2)): Promise<void> {
      const result = await execute(definition, argv);
      process.exitCode = result.exitCode;
      if (result.diagnostic) process.stderr.write(`${result.diagnostic}\n`);
      if (result.output) process.stdout.write(`${result.output}\n`);
    },
  };
}

type Execution = { exitCode: number; output?: string; diagnostic?: string };
type Resolved = { node: Command; path: string[]; rest: string[] };
type Violation = { field: string; received: string; expected: string; schema: boolean };

async function execute(definition: CliDefinition, argv: string[]): Promise<Execution> {
  const json = argv.includes("--json");
  try {
    assertTree(definition.name, definition.commands);
    const resolved = resolve(definition, argv);
    if ("children" in resolved.node) {
      if (resolved.path.length === 1 && (resolved.rest.length === 0 || (resolved.rest.length === 1 && resolved.rest[0] === "-h"))) return success(await renderRootHelp(definition));
      if (resolved.rest.length === 1 && resolved.rest[0] === "-h") return success(await renderBranchHelp(resolved.node));
      return failure(renderError(resolved.path, "missing_subcommand", [{ field: "command", received: displayArgs(resolved.rest), expected: `a subcommand of \`${resolved.path.join(" ")}\``, schema: true }], json));
    }

    const leaf = resolved.node;
    const help = resolveHelp(leaf, resolved.path, resolved.rest, json);
    if (help) return help.error ? failure(await help.output) : success(await help.output);
    const parsed = await parseInput(leaf, resolved.path, resolved.rest);
    if (parsed.error) return failure(renderError(resolved.path, errorCode(parsed.error.violations), parsed.error.violations, parsed.json));
    const context: RunContext = { argv, stdin: parsed.stdin, json: parsed.json };
    const returned = await leaf.run(parsed.input, context);
    if (leaf.stream) {
      if (!isAsyncIterable(returned)) throw new Error("A streaming leaf must return an AsyncIterable.");
      const records: string[] = [];
      const jsonRecords: unknown[] = [];
      for await (const value of returned) {
        jsonRecords.push(value);
        records.push(renderResult(leaf, value, parsed.input));
      }
      return success(parsed.json ? JSON.stringify(jsonRecords) : records.join("\n"));
    }
    if (isAsyncIterable(returned)) throw new Error("A non-streaming leaf returned an AsyncIterable.");
    return success(parsed.json ? JSON.stringify(returned) : renderResult(leaf, returned, parsed.input));
  } catch (error) {
    if (error instanceof CommandError) return failure(renderError([], error.code, [{ field: error.field, received: error.received, expected: error.expected, schema: false }], json, error.next, error.message));
    return { exitCode: 1, output: renderError([], "internal", [{ field: "command", received: "command execution", expected: "a successful handler", schema: false }], json, "Inspect the repository CLI implementation and retry.", "The command could not complete.") };
  }
}

function resolve(definition: CliDefinition, argv: string[]): Resolved {
  let node: Command = { ...definition, name: definition.name, whenToUse: "", children: definition.commands };
  const path = [definition.name];
  let index = 0;
  while ("children" in node && index < argv.length && !argv[index].startsWith("-")) {
    const child = node.children.find((candidate) => candidate.name === argv[index]);
    if (!child) break;
    node = child;
    path.push(child.name);
    index += 1;
  }
  return { node, path, rest: argv.slice(index) };
}

function resolveHelp(leaf: Leaf, path: string[], args: string[], json: boolean): { output: string | Promise<string>; error: boolean } | undefined {
  if (args.length === 1 && args[0] === "-h") return { output: renderLeafHelp(leaf, path), error: false };
  if (args.length === 2 && args[1] === "-h" && args[0].startsWith("--")) {
    const name = args[0].slice(2);
    const parameter = leaf.params?.find((candidate) => candidate.kind === "flag" && candidate.name === name);
    if (!parameter?.focused) return { output: renderError(path, "unknown_parameter", [{ field: `--${name}`, received: args[0], expected: "a declared parameter with focused help", schema: true }], json), error: true };
    return { output: renderFocusedHelp(leaf, path, parameter), error: false };
  }
  return undefined;
}

async function parseInput(leaf: Leaf, path: string[], args: string[]): Promise<{ input: Record<string, InputValue>; stdin: string | undefined; json: boolean; error?: { violations: Violation[] } }> {
  const parameters = leaf.params ?? [];
  const flags = parameters.filter((parameter) => parameter.kind === "flag");
  const positional = parameters.filter((parameter) => parameter.kind === "positional");
  const input: Record<string, InputValue> = {};
  const violations: Violation[] = [];
  let json = false;
  let positionalIndex = 0;

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "--json") {
      if (json) violations.push({ field: "--json", received: "--json", expected: "the global flag at most once", schema: true });
      json = true;
      continue;
    }
    if (token.startsWith("--")) {
      const [rawName, inlineValue] = token.slice(2).split(/=(.*)/s, 2);
      const parameter = flags.find((candidate) => candidate.name === rawName);
      if (!parameter) {
        violations.push({ field: `--${rawName}`, received: token, expected: "a declared parameter", schema: true });
        continue;
      }
      if (parameter.type === "boolean") {
        if (inlineValue !== undefined) violations.push({ field: `--${rawName}`, received: token, expected: "a boolean flag with no value", schema: true });
        else if (input[rawName] === true) violations.push({ field: `--${rawName}`, received: token, expected: "the flag at most once", schema: true });
        else input[rawName] = true;
        continue;
      }
      const rawValue = inlineValue ?? args[++index];
      if (rawValue === undefined || rawValue.startsWith("--")) {
        if (rawValue?.startsWith("--")) index -= 1;
        violations.push({ field: `--${rawName}`, received: rawValue === undefined ? "nothing" : rawValue, expected: `${typeLabel(parameter)} after --${rawName}`, schema: true });
        continue;
      }
      addValue(input, parameter, rawValue, violations);
      continue;
    }
    const parameter = positional[positionalIndex];
    if (!parameter) {
      violations.push({ field: "argument", received: token, expected: positional.length === 0 ? "no positional arguments" : "at most one declared positional argument", schema: true });
      continue;
    }
    addValue(input, parameter, token, violations);
    positionalIndex += 1;
  }

  for (const parameter of parameters) {
    if (parameter.kind === "stdin") continue;
    if (input[parameter.name] === undefined && parameter.default !== undefined) input[parameter.name] = parameter.default;
    if (parameter.type === "boolean" && input[parameter.name] === undefined && !parameter.required) input[parameter.name] = false;
    if (parameter.required && input[parameter.name] === undefined) violations.push({ field: parameterDisplay(parameter), received: "omitted", expected: "a required value", schema: true });
  }

  const stdinParameter = parameters.find((parameter) => parameter.kind === "stdin");
  const stdin = stdinParameter ? await readStdin() : undefined;
  if (stdinParameter) {
    input[stdinParameter.name] = stdin;
    if (stdinParameter.required && !stdin) violations.push({ field: "stdin", received: "empty stdin", expected: "required piped content", schema: true });
  }

  for (const parameter of parameters) {
    const value = input[parameter.name];
    if (value === undefined) continue;
    validateValue(parameter, value, input, violations);
  }

  if (violations.length > 0) return { input, stdin, json, error: { violations } };
  return { input, stdin, json };
}

function addValue(input: Record<string, InputValue>, parameter: Parameter, rawValue: string, violations: Violation[]): void {
  const parsed = parseValue(parameter, rawValue);
  if (parsed.error) {
    violations.push({ field: parameterDisplay(parameter), received: rawValue, expected: parsed.error, schema: false });
    return;
  }
  const current = input[parameter.name];
  if (parameter.repeatable) {
    input[parameter.name] = [...(Array.isArray(current) ? current : []), parsed.value!];
  } else if (current !== undefined) {
    violations.push({ field: parameterDisplay(parameter), received: rawValue, expected: "the parameter at most once", schema: true });
  } else {
    input[parameter.name] = parsed.value;
  }
}

function parseValue(parameter: Parameter, rawValue: string): { value?: JsonValue; error?: string } {
  if (parameter.type === "integer") {
    if (!/^-?\d+$/.test(rawValue)) return { error: "an integer" };
    const value = Number(rawValue);
    if (!Number.isSafeInteger(value)) return { error: "a safe integer" };
    return { value };
  }
  if (parameter.type === "json") {
    try { return { value: JSON.parse(rawValue) as JsonValue }; } catch { return { error: "valid inline JSON" }; }
  }
  if (parameter.type === "enum" && !parameter.values?.includes(rawValue)) return { error: `one of: ${parameter.values?.join(", ") ?? "the declared values"}` };
  return { value: rawValue };
}

function validateValue(parameter: Parameter, value: InputValue, input: Readonly<Record<string, InputValue>>, violations: Violation[]): void {
  const values = parameter.repeatable && Array.isArray(value) ? value : [value];
  for (const item of values) {
    if (typeof item === "number") {
      if (parameter.min !== undefined && item < parameter.min) violations.push({ field: parameterDisplay(parameter), received: String(item), expected: `an integer at least ${parameter.min}`, schema: false });
      if (parameter.max !== undefined && item > parameter.max) violations.push({ field: parameterDisplay(parameter), received: String(item), expected: `an integer at most ${parameter.max}`, schema: false });
    }
    if (typeof item === "string" && parameter.pattern && !parameter.pattern.test(item)) violations.push({ field: parameterDisplay(parameter), received: item, expected: parameter.description, schema: false });
  }
  const custom = parameter.validate?.(value, input);
  if (custom) violations.push({ field: parameterDisplay(parameter), received: formatValue(value), expected: custom, schema: false });
}

function errorCode(violations: Violation[]): string {
  return violations.some((violation) => violation.schema) ? "invalid_invocation" : "invalid_value";
}

function renderError(path: string[], code: string, violations: Violation[], json: boolean, next?: string, message = "Command input did not satisfy its declared constraints."): string {
  const recovery = next ?? (violations.some((violation) => violation.schema) ? `Run \`${path.join(" ")} -h\` and read the schema before re-issuing.` : "Correct every listed value and retry.");
  if (json) return JSON.stringify({ error: code, message, received: violations.map((violation) => ({ field: violation.field, value: violation.received })), expected: violations.map((violation) => ({ field: violation.field, value: violation.expected })), field: violations.map((violation) => violation.field), next: recovery });
  return `<error code="${escapeXml(code)}">\nreceived: ${violations.map((violation) => `${escapeXml(violation.field)}=${escapeXml(violation.received)}`).join("; ")}\nviolations:\n${violations.map((violation) => `- ${escapeXml(violation.field)}: received ${escapeXml(violation.received)}; expected ${escapeXml(violation.expected)}.`).join("\n")}\nNext: ${escapeXml(recovery)}\n</error>`;
}

async function renderRootHelp(definition: CliDefinition): Promise<string> {
  const blocks = await Promise.all(definition.commands.map(renderCommandBlock));
  return `${definition.name}: ${line(definition.description)}\n\n${blocks.join("\n\n")}\n\nGlobals\n  -h      print help for a command node or leaf\n  --json  mirror a leaf result or error as JSON\n\nI/O contract: flags and positional args on input; stdout is agent-ready markdown/XML you act on directly — read it as a continuation of your prompt, don't parse it as data.\nExit 0 on success, non-zero on failure. Schemas appear at leaf -h.`;
}

async function renderCommandBlock(command: Command): Promise<string> {
  const state = "children" in command ? await renderState(await command.state?.()) : undefined;
  const contents = [escapeXml(line(command.description)), `use when ${escapeXml(line(command.whenToUse))}`, state].filter(Boolean).join("\n");
  return `<command name="${escapeXml(command.name)}">\n${contents}\n</command>`;
}

async function renderBranchHelp(branch: Branch): Promise<string> {
  const state = await renderState(await branch.state?.());
  const model = [state, branch.model ? `<model>${escapeXml(line(branch.model))}</model>` : undefined].filter(Boolean).join("\n");
  const children = branch.children.map((child) => `<subcommand name="${escapeXml(child.name)}" description="${escapeXml(line(child.description))}" whenToUse="${escapeXml(line(child.whenToUse))}"/>`).join("\n");
  return `<command name="${escapeXml(branch.name)}" description="${escapeXml(line(branch.description))}">${model ? `\n${model}` : ""}\n${children}\n</command>`;
}

function renderState(state: StateBlock | undefined): string | undefined {
  if (!state) return undefined;
  if (state.name === "command" || !/^[a-z][a-z0-9-]*$/.test(state.name)) throw new Error("State block names must be lowercase kebab-case and cannot be command.");
  const attributes = Object.entries(state.attributes ?? {}).filter(([, value]) => value !== null && value !== undefined).map(([name, value]) => ` ${name}="${escapeXml(String(value))}"`).join("");
  return state.body ? `<${state.name}${attributes}>\n${escapeXml(state.body)}\n</${state.name}>` : `<${state.name}${attributes}/>`;
}

function renderLeafHelp(leaf: Leaf, path: string[]): string {
  const input = leaf.params?.length ? leaf.params.map((parameter) => renderParameter(parameter, path)).join("\n") : "  None.";
  const output = leaf.output.map((field) => `  ${pad(field.name, 16)} ${field.type}. ${line(field.description)}`).join("\n");
  const effects = leaf.effects.length ? leaf.effects.map((effect) => `  ${line(effect)}`).join("\n") : "  None.";
  return `${path.join(" ")}: ${line(leaf.description)}\n\nInput\n${input}\n\nOutput (fields carried in the rendered result)\n${output}\n\nEffects\n${effects}`;
}

async function renderFocusedHelp(leaf: Leaf, path: string[], parameter: Parameter): Promise<string> {
  const focused = parameter.focused!;
  const state = await renderState(await focused.state?.());
  const sections = ["When to use", `  ${line(focused.whenToUse)}`, "Value", `  ${line(focused.value)}`, focused.effects?.length ? `Effects\n${focused.effects.map((effect) => `  ${line(effect)}`).join("\n")}` : undefined, focused.interactions?.length ? `Interactions\n${focused.interactions.map((interaction) => `  ${line(interaction)}`).join("\n")}` : undefined, state].filter(Boolean).join("\n");
  return `${path.join(" ")}: ${line(leaf.description)}\n\n<parameter name="${escapeXml(parameter.name)}">\n${sections}\n</parameter>`;
}

function renderParameter(parameter: Parameter, path: string[]): string {
  const name = parameter.kind === "flag" ? `--${parameter.name}${parameter.type === "boolean" ? "" : ` ${typeLabel(parameter)}`}` : parameter.kind === "stdin" ? "stdin" : parameter.name.toUpperCase();
  const requirement = parameter.required ? "required" : "optional";
  const defaultValue = parameter.default !== undefined ? ` Default: ${String(parameter.default)}.` : "";
  const repeatable = parameter.repeatable ? " Repeatable." : "";
  const focused = parameter.focused && parameter.kind === "flag" ? ` Before using this parameter, run \`${path.join(" ")} --${parameter.name} -h\`.` : "";
  return `  ${pad(name, 22)} ${requirement}. ${line(parameter.description)}${defaultValue}${repeatable}${focused}`;
}

function renderResult(leaf: Leaf, value: unknown, input: Readonly<Record<string, InputValue>>): string {
  const rendered = leaf.result.render(value, input);
  const attributes = Object.entries(rendered.attributes ?? {}).filter(([, attribute]) => attribute !== null && attribute !== undefined).map(([name, attribute]) => ` ${name}="${escapeXml(String(attribute))}"`).join("");
  const body = rendered.body ? `\n${escapeXml(rendered.body)}\n` : "";
  return `<${leaf.result.block}${attributes}>${body}</${leaf.result.block}>`;
}

function assertTree(name: string, commands: Command[]): void {
  const seen = new Set<string>();
  for (const command of commands) {
    if (!/^[a-z][a-z0-9-]*$/.test(command.name)) throw new Error(`${name}: command names must be lowercase kebab-case.`);
    if (seen.has(command.name)) throw new Error(`${name}: duplicate command ${command.name}.`);
    seen.add(command.name);
    if ("children" in command) assertTree(`${name} ${command.name}`, command.children);
    else {
      if (!/^[a-z][a-z0-9-]*$/.test(command.result.block)) throw new Error(`${name} ${command.name}: result block names must be lowercase kebab-case.`);
      const parameters = command.params ?? [];
      const positional = parameters.filter((parameter) => parameter.kind === "positional");
      if (positional.length > 1) throw new Error(`${name} ${command.name}: a leaf may have at most one positional parameter.`);
      if (parameters.filter((parameter) => parameter.kind === "stdin").length > 1) throw new Error(`${name} ${command.name}: a leaf may have at most one stdin parameter.`);
      const parameterNames = new Set<string>();
      for (const parameter of parameters) {
        if (parameterNames.has(parameter.name)) throw new Error(`${name} ${command.name}: duplicate parameter ${parameter.name}.`);
        parameterNames.add(parameter.name);
        if (parameter.kind === "flag" && !/^[a-z][a-z0-9-]*$/.test(parameter.name)) throw new Error(`${name} ${command.name}: flag names must be lowercase kebab-case.`);
        if (parameter.kind === "flag" && parameter.name === "json") throw new Error(`${name} ${command.name}: --json is reserved as a global flag.`);
      }
    }
  }
}

function parameterDisplay(parameter: Parameter): string {
  return parameter.kind === "flag" ? `--${parameter.name}` : parameter.kind === "stdin" ? "stdin" : parameter.name.toUpperCase();
}

function typeLabel(parameter: Parameter): string {
  if (parameter.type === "integer") return "N";
  if (parameter.type === "path") return "PATH";
  if (parameter.type === "json") return "JSON";
  if (parameter.type === "enum") return parameter.name.toUpperCase();
  return parameter.name.toUpperCase();
}

function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  return Boolean(value) && typeof (value as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function";
}

function readStdin(): Promise<string | undefined> {
  if (process.stdin.isTTY) return Promise.resolve(undefined);
  return new Promise((resolve, reject) => {
    let content = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { content += chunk; });
    process.stdin.on("end", () => resolve(content || undefined));
    process.stdin.on("error", reject);
  });
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function line(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function displayArgs(args: string[]): string {
  return args.length ? args.map((argument) => `\`${argument}\``).join(" ") : "no arguments";
}

function formatValue(value: InputValue): string {
  return Array.isArray(value) ? value.join(", ") : String(value);
}

function pad(value: string, width: number): string {
  return value.padEnd(width);
}

function success(output: string): Execution {
  return { exitCode: 0, output };
}

function failure(output: string): Execution {
  return { exitCode: 1, output };
}
