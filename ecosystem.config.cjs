module.exports = {
  apps: [
    {
      name: "MovieWatcher",
      script: "npm",
      args: "run dev -- --host 0.0.0.0 --port 5173",
      env: {
        NODE_ENV: "development",
      },
      watch: false,
      max_memory_restart: "1G",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      merge_logs: true,
      time: true
    }
  ]
}
