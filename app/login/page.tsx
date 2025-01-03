import { Main } from '@/components/Main';
import { AlertProvider } from '@/components/Alert';
import { Login } from '@Features/login/Login';

const LoginPage = () => {
  return (
    <AlertProvider>
      <Main>
        <Login />
      </Main>
    </AlertProvider>
  );
};

export default LoginPage;
