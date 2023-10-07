const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");

class TimestampFirst {
  constructor(enabled = true) {
    this.enabled = enabled;
  }
  transform(obj) {
    if (this.enabled) {
      return Object.assign(
        {
          timestamp: Date.now(),
        },
        obj
      );
    }
    return obj;
  }
}

const timestampFormat2 = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD_HH:mm:ss",
  }),
  winston.format.json()
);

const formatTransportType = (type) => {
  const transporter = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, `./logs/%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    level: type,
    format: winston.format.combine(
      winston.format.errors({
        stack: true,
      }),
      winston.format.json()
    ),
  });

  return transporter;
};

const levels = {
  start: 0,
  error: 1,
  debug: 1,
  info: 2,
  load: 2,
  db: 2,
  cmd: 2,
  dev: 7
};


const colors = {
  start: "grey",
  error: "red",
  debug: "yellow",
  info: "green",
  load: "blue",
  db: "magenta",
  cmd: "cyan",
  dev: "red"
};

const start = winston.createLogger({
  format: timestampFormat2,
  level: "start",
  levels: levels,
  transports: [formatTransportType("start")],
});

const error = winston.createLogger({
  format: timestampFormat2,
  level: "error",
  levels: levels,
  transports: [formatTransportType("error")],
});

const debug = winston.createLogger({
  format: timestampFormat2,
  level: "debug",
  levels: levels,
  transports: [formatTransportType("debug")],
});

const info = winston.createLogger({
  format: timestampFormat2,
  level: "info",
  levels: levels,
  transports: [formatTransportType("info")],
});

const load = winston.createLogger({
  format: timestampFormat2,
  level: "load",
  levels: levels,
  transports: [formatTransportType("load")],
});

const db = winston.createLogger({
  format: timestampFormat2,
  level: "db",
  levels: levels,
  transports: [formatTransportType("db")],
});

const cmd = winston.createLogger({
  format: timestampFormat2,
  level: "cmd",
  levels: levels,
  transports: [formatTransportType("cmd")],
})

const dev = winston.createLogger({
  format: timestampFormat2,
  level: "dev",
  levels: levels,
  transports: [formatTransportType("dev")],
})

start.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);

error.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);

info.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);

load.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);

db.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);

cmd.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);


debug.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);

dev.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        colors: colors,
      }),
      winston.format.simple()
    ),
  })
);


module.exports = {
  start: (message, data = {}) => start.start(message, data),
  error: (message, data = {}) => error.error(message, data),
  debug: (message, data = {}) => debug.debug(message, data),
  info: (message, data = {}) => info.info(message, data),
  load: (message, data = {}) => load.load(message, data),
  db: (message, data = {}) => db.db(message, data),
  cmd: (message, data = {}) => cmd.cmd(message, data),
  dev: (message, data = {}) => dev.dev(message, data),
};