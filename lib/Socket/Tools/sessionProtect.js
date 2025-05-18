const fs = require('fs');
const path = require('path');

function protectSocket(ws, isAntiCloseSession, logger) {
    const originalClose = ws.close.bind(ws);
    ws.close = (...args) => {
        if (isAntiCloseSession) {
            logger.warn('Attempt to close WebSocket denied (Anti-Close Session Enabled)');
            return;
        }
        originalClose(...args);
    };
}

function patchRawSocketOnOpen(ws, isAntiCloseSession, logger) {
    if (ws.socket?.close) {
        const rawClose = ws.socket.close.bind(ws.socket);
        ws.socket.close = (...args) => {
            if (isAntiCloseSession) {
                logger.warn('Attempt to close RAW socket denied (Anti-Close Session Enabled)');
                return;
            }
            rawClose(...args);
        };
    }
}

function cleanupDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.lstatSync(fullPath).isFile()) {
            fs.unlinkSync(fullPath);
        }
    }
}

module.exports = {
    protectSocket,
    patchRawSocketOnOpen,
    cleanupDirectory
};