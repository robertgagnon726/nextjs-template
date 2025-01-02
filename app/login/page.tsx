import { Main } from '@/components/Main';
import { AlertProvider } from '@/components/Alert';
import { Login } from '@Features/login/Login';

const LoginPage = ({ params }: { params: { account: string } }) => {
  return (
    <AlertProvider>
      <Main>
        <Login pageParams={params} />
      </Main>
    </AlertProvider>
  );
};

export default LoginPage;
