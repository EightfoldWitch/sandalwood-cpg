npm init -y
npm install express socket.io uuid fs-extra

:: set up the jest test framework
npm install --save-dev jest supertest

:: set up the react
npx create-react-app frontend
cd frontend
npm install socket.io-client axios @mui/material @emotion/react @emotion/styled @mui/icons-material
