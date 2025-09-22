module.exports = {
  apps: [
    {
      name: 'pdfville-frontend',
      cwd: '/home/ubuntu/pdfville/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'pdfville-backend',
      cwd: '/home/ubuntu/pdfville/backend',
      script: '/home/ubuntu/pdfville/backend/venv/bin/python',
      args: '-m flask run --host=0.0.0.0 --port=5000',
      env: {
        FLASK_ENV: 'production',
        FLASK_APP: 'app.py'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
