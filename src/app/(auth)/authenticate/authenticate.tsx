import TabSwitcher from '@/components/tabswitcher';
import { SignIn } from '@/app/(auth)/authenticate/SignIn';
import { SignUp } from '@/app/(auth)/authenticate/SignUp';

export const Authenticate = () => {
    return (
        <div className='min-w-[500px] max-w-3xl'>
            <TabSwitcher SignInTab={<SignIn />} SignUpTab={<SignUp />} />
        </div>
    );
};
