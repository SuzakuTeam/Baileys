function logEvent(config, eventType, data = {}) {
    if (!config?.debug) return;
    const timestamp = new Date().toISOString()
    const line = `[${timestamp}] [${eventType.toUpperCase()}] ${JSON.stringify(data, null, 2)}`
    console.log(line)
}

module.exports = logEvent;