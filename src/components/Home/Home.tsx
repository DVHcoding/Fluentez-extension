// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################

const Home: React.FC = () => {
    const handleLoginClick = () => {
        chrome.tabs.update({
            url: 'https://fluentez.com/login',
        });
    };

    const handleSignUpClick = () => {
        chrome.tabs.update({
            url: 'https://fluentez.com/register',
        });
    };

    return (
        <div className="h-[500px] rounded-md border border-gray-300 shadow-md">
            {/* Header */}
            <div
                className="flex items-center justify-between gap-2
                border-b border-gray-400 p-2"
            >
                <span>FLuentez</span>

                <span>Disabled on this page</span>
            </div>

            {/* Body */}
            <div className="mt-2 flex flex-col items-center gap-2">
                <h4 className="text-lg font-medium">Please login ot start using Fluentez</h4>

                <button
                    className="rounded-md bg-blue-500 px-4 py-2 text-base
                   text-white"
                    onClick={handleLoginClick}
                >
                    Log in
                </button>
                <div>
                    <span className="text-base">Dont have account? </span>
                    <a
                        href="https://fluentez.com/register"
                        className="text-base transition-all hover:text-blue-500"
                        onClick={handleSignUpClick}
                    >
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
