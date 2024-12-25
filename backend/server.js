const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 2000;
const BASE_DIR = path.join(__dirname, '../frontend', 'pages'); // Path to HTML files
const STATIC_DIR = path.join(__dirname, '../frontend'); // Path to the frontend assets (css, images, js)
const USERS_FILE = path.join(__dirname, 'users.json'); // Path to store user data

// Helper function to serve files
function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Page Not Found</h1>');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// Helper functions for user authentication
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Content-Type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

// Create the server
const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  // Serve static assets (css, images, js)
  if (req.url.startsWith('/css') || req.url.startsWith('/images') || req.url.startsWith('/js')) {
    const staticPath = path.join(STATIC_DIR, req.url);
    const extname = path.extname(staticPath);
    const contentType = mimeTypes[extname] || 'text/plain';
    return serveFile(res, staticPath, contentType);
  }

  // Authentication API routes
  if (url === '/register' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      const users = readUsers();

      if (users.some((user) => user.username === username)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User already exists' }));
        return;
      }

      users.push({ username, password });
      writeUsers(users);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Registration successful' }));
    });
    return;
  }

  if (url === '/login' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      const users = readUsers();

      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful' }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }
    });
    return;
  }

  if (url === '/logout' && method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Logout successful' }));
    return;
  }

  // Routing logic for HTML pages
  let filePath;
  switch (url) {
    case '/':
      filePath = path.join(BASE_DIR, 'home.html');
      break;
    case '/about':
      filePath = path.join(BASE_DIR, 'about.html');
      break;
    case '/rooms':
      filePath = path.join(BASE_DIR, 'rooms.html');
      break;
    case '/room-details':
      filePath = path.join(BASE_DIR, 'room-details.html');
      break;
    case '/booking':
      filePath = path.join(BASE_DIR, 'booking.html');
      break;
    case '/payment':
      filePath = path.join(BASE_DIR, 'payment.html');
      break;
    case '/profile':
      filePath = path.join(BASE_DIR, 'profile.html');
      break;
    case '/contact':
      filePath = path.join(BASE_DIR, 'contact.html');
      break;
    case '/faq':
      filePath = path.join(BASE_DIR, 'faq.html');
      break;
    case '/admin':
      filePath = path.join(BASE_DIR, 'admin.html');
      break;
    case '/confirmation':
      filePath = path.join(BASE_DIR, 'confirmation.html');
      break;
    default:
      filePath = null;
      break;
  }

  // Serve the HTML page
  if (filePath) {
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'text/plain';
    serveFile(res, filePath, contentType);
  } else {
    // Serve 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
