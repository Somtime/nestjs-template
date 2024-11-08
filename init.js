const { createReadLine, readLineConfirm, createDotEnv, checkDotEnv, updatePackageJson } = require('./init-func.js');

const main = async () => {
  const readLine = createReadLine();
  const envFile = checkDotEnv();
  let envFileCreate = true;

  if (envFile) {
    const confirmExistEnv = await readLineConfirm(readLine, '이미 설정된 env 파일이 존재합니다. 더 이상 진행 시 해당 파일이 손상될 수 있습니다. env 파일을 생성하시겠습니까? (Y/N): ');
    if (confirmExistEnv.toLowerCase() !== 'y' && confirmExistEnv.toLowerCase() !== 'yes') {
      envFileCreate = false;
    }
  }

  const confirmDatabase = await readLineConfirm(readLine, '데이터베이스 생성 및 유저 생성을 완료하셨습니까? (Y/N): ');
  if (confirmDatabase.toLowerCase() !== 'y' && confirmDatabase.toLowerCase() !== 'yes') {
    console.log('완료 후 다시 시도해 주십시오.');
    readLine.close();
    return;
  }

  const dbName = await readLineConfirm(readLine, '데이터베이스를 입력해주세요: ');
  const dbUser = await readLineConfirm(readLine, '유저를 입력해주세요: ');
  const dbPassword = await readLineConfirm(readLine, '비밀번호를 입력해주세요: ');

  const appName = await readLineConfirm(readLine, '앱 이름을 입력해주세요: (dev)') || 'dev';
  const appPort = await readLineConfirm(readLine, '사용할 port를 입력해주세요: (3000)') || 3000;
  const appHost = await readLineConfirm(readLine, '서버 host을 입력해주세요: (127.0.0.1)') || `http://127.0.0.1:${appPort}/` ;

  const dbHost = await readLineConfirm(readLine, '데이터베이스 host을 입력해주세요: (127.0.0.1)') || '127.0.0.1';
  const dbPort = await readLineConfirm(readLine, '데이터베이스 port를 입력해주세요: (3306)') || 3306;

  readLine.close();

  const data = {
    dbName, dbUser, dbPassword, appName, appHost, appPort, dbHost, dbPort
  }

  if (envFileCreate) createDotEnv(data);
  updatePackageJson(appName);
}
main();