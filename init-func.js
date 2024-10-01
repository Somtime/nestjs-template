const fs = require('fs');
const path = require('path');
const readline = require("readline");
const { stdin: input, stdout: output } = require('process');

const createReadLine = () => {
  return readline.createInterface({ input, output });
}

const readLineConfirm = (rl, question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

const createDotEnv = (data) => {
  // .env 파일에 작성할 내용
  const envContent = `
      APP_NAME=${data.appName || 'dev'}
      APP_PORT=${data.appPort || 3000}
      APP_HOSTNAME=${data.appHost || 'http://127.0.0.1'}
      DB_DATABASE=${data.dbName}
      DB_HOSTNAME=${data.dbHost || '127.0.0.1'}
      DB_USERNAME=${data.dbUser}
      DB_PASSWORD=${data.dbPassword || '127.0.0.1'}
      DB_PORT=${data.dbPort || 3306}
  `;

  // .env 파일을 저장할 경로 설정
  const envFilePath = path.join(__dirname, '.env');

  // .env 파일 생성 및 내용 작성
  fs.writeFile(envFilePath, envContent.trim(), (err) => {
    if (err) {
      console.error('Error writing .env file:', err);
    } else {
      console.log('.env file created successfully');
    }
  });
}

const checkDotEnv = () => {
  // 현재 디렉토리에서 .env 파일 경로 설정
  const envFilePath = path.resolve(__dirname, '.env');

  // 파일 존재 여부 확인
  if (fs.existsSync(envFilePath)) {
    console.log('.env 파일이 존재합니다.');
    return true; // 파일이 존재하면 true 반환
  } else {
    console.log('.env 파일이 존재하지 않습니다.');
    return false; // 파일이 없으면 false 반환
  }
}

const updatePackageJson = (appName) => {
  // package.json 파일 경로 설정
  const packageJsonPath = path.join(__dirname, 'package.json');

  // package.json 파일 읽기
  fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading package.json:', err);
      return;
    }

    // JSON 파싱
    let packageJson = JSON.parse(data);

    // appName으로 "name" 필드 수정
    packageJson.name = appName;

    // 수정된 내용을 다시 JSON 문자열로 변환
    const updatedPackageJson = JSON.stringify(packageJson, null, 2); // 2는 들여쓰기 간격

    // 수정된 package.json 파일 쓰기
    fs.writeFile(packageJsonPath, updatedPackageJson, 'utf8', (err) => {
      console.log('package edit');
      if (err) {
        console.error('Error writing package.json:', err);
      } else {
        console.log('package.json updated successfully');
      }
    });
  });
};


module.exports = { createReadLine, readLineConfirm, createDotEnv, checkDotEnv, updatePackageJson }