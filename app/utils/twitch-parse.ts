export const parseTwitchIrcMessage = (raw: string): TwitchParsedMessage | null => {
  const line = raw.trim();

  if (!line) {
    return null;
  }

  let rest = line;
  const tags: Record<string, string> = {};
  let prefix: string | undefined;

  if (rest.startsWith("@")) {
    const tagEnd = rest.indexOf(" ");
    const rawTags = (tagEnd === -1 ? rest.slice(1) : rest.slice(1, tagEnd)).split(";");

    for (const entry of rawTags) {
      if (!entry) {
        continue;
      }

      const [key, value = ""] = entry.split("=");

      if (!key) {
        continue;
      }

      tags[key] = value;
    }

    rest = tagEnd === -1 ? "" : rest.slice(tagEnd + 1).trimStart();
  }

  if (rest.startsWith(":")) {
    const prefixEnd = rest.indexOf(" ");
    prefix = prefixEnd === -1 ? rest.slice(1) : rest.slice(1, prefixEnd);
    rest = prefixEnd === -1 ? "" : rest.slice(prefixEnd + 1).trimStart();
  }

  if (!rest) {
    return null;
  }

  const commandEnd = rest.indexOf(" ");
  const command = (commandEnd === -1 ? rest : rest.slice(0, commandEnd)).toUpperCase();
  rest = commandEnd === -1 ? "" : rest.slice(commandEnd + 1).trimStart();

  const params: string[] = [];
  let trailing: string | undefined;

  while (rest.length > 0) {
    if (rest.startsWith(":")) {
      trailing = rest.slice(1);
      break;
    }

    const nextSpace = rest.indexOf(" ");

    if (nextSpace === -1) {
      params.push(rest);
      break;
    }

    params.push(rest.slice(0, nextSpace));
    rest = rest.slice(nextSpace + 1).trimStart();
  }

  const channel = params.find(param => param.startsWith("#"));
  const login = prefix?.split("!")[0];
  const ctcpDelimiter = "\u0001";
  let normalizedTrailing = trailing;
  let isAction = false;

  if (trailing) {
    if (trailing.startsWith(`${ctcpDelimiter}ACTION `) && trailing.endsWith(ctcpDelimiter)) {
      isAction = true;
      normalizedTrailing = trailing.slice(8, -1);
    }
    else {
      normalizedTrailing = trailing.replaceAll(ctcpDelimiter, "");
    }
  }

  return {
    raw: line,
    tags,
    prefix,
    command,
    params,
    text: normalizedTrailing,
    channel,
    login,
    displayName: tags["display-name"] || login,
    color: tags.color || undefined,
    isAction
  };
};
