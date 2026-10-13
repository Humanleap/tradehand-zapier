const URL = 'https://tradehand.com/api/mcp';

// One JSON-RPC call to a Tradehand tool. Returns the tool result; throws the
// server's own sentence for every error shape. A search passes `notFoundCode`
// to get null back for that one server code (Zapier wants [] for no match).
const call = async (z, name, args, notFoundCode) => {
  const res = await z.request({
    url: URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': '2025-06-18',
    },
    body: {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name, arguments: args },
    },
    skipThrowForStatus: true,
  });
  const { result, error } = res.data || {};
  if (error) throw new z.errors.Error(error.message, String(error.code));
  if (res.status < 200 || res.status >= 300) {
    throw new z.errors.Error(
      `Tradehand answered with HTTP ${res.status}.`,
      'http_error',
      res.status,
    );
  }
  if (!result) throw new z.errors.Error('Tradehand sent an empty answer.');
  const structured = result.structuredContent;
  if (structured && structured.outcome === 'blocked') {
    const [blocker] = structured.blockers;
    if (notFoundCode && blocker.code === notFoundCode) return null;
    throw new z.errors.Error(blocker.message, blocker.code);
  }
  if (result.isError) {
    throw new z.errors.Error(result.content[0].text, result.code);
  }
  return result;
};

module.exports = { call };
