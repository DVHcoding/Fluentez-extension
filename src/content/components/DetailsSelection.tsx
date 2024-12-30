// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { createPortal } from 'react-dom';
import { Button, Checkbox } from 'antd';
import TextareaAutosize from 'react-textarea-autosize';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import { Position } from './TextSelection';
import { useUserDetailsQuery } from '../store/api/userApi';

interface DetailsProps {
    position: Position;
}

const DetailsSelection: React.FC<DetailsProps> = ({ position }) => {
    /* ########################################################################## */
    /*                                    HOOKS                                   */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                               REACT ROUTE DOM                              */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                              STATE MANAGEMENT                              */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                     RTK                                    */
    /* ########################################################################## */
    const { data } = useUserDetailsQuery();

    /* ########################################################################## */
    /*                                  VARIABLES                                 */
    /* ########################################################################## */
    const LOGO_CONFIG = {
        SIZE: '20px',
        OFFSET_TOP: 50,
        DISPLAY_DURATION: 2000,
        FADE_DURATION: 300,
        Z_INDEX: 9999,
    };

    /* ########################################################################## */
    /*                             FUNCTION MANAGEMENT                            */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                CUSTOM HOOKS                                */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                  useEffect                                 */
    /* ########################################################################## */

    return createPortal(
        <div
            id="Ψdetails"
            style={{
                position: 'fixed',
                top: `${position.top - LOGO_CONFIG.OFFSET_TOP}px`,
                left: `${position.left}px`,
                transition: `opacity ${LOGO_CONFIG.FADE_DURATION}ms`,
                opacity: 1,
                width: '365px',
                height: '330px',
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                borderRadius: '8px',
                transform: 'translate(-50%, -50%)',
                padding: '10px',
                zIndex: '9999999999999999',
            }}
            onMouseUp={(event) => {
                event.stopPropagation();
            }}
            className="scrollbar-mess overflow-auto bg-white"
        >
            <form className="phone:w-full relative max-h-[350px] select-none rounded-md bg-white p-4 md:max-w-[536px]">
                <div>
                    <Button type="primary" htmlType="submit">
                        Thêm vào
                    </Button>
                </div>

                <div className="flex items-end justify-between gap-6">
                    {/* Left */}
                    <div className="w-full">
                        <TextareaAutosize
                            className="scrollbar-mess mt-4 w-full resize-none border-b-4 
                            border-b-green-200 bg-transparent p-1 text-left text-lg text-black
                            outline-none"
                            maxRows={3}
                            spellCheck={false}
                            maxLength={500}
                            autoFocus
                            required
                        />
                        <p className="font-sans font-medium uppercase">Thuật ngữ</p>
                    </div>

                    {/* Right */}
                    <div className="w-full">
                        <TextareaAutosize
                            className="scrollbar-mess mt-4 w-full resize-none border-b-4 
                          border-b-green-200 bg-transparent p-1 text-left text-lg text-black
                            outline-none"
                            maxRows={3}
                            spellCheck={false}
                            maxLength={500}
                            required
                        />
                        <p className="font-sans font-medium uppercase ">Định nghĩa</p>
                    </div>
                </div>

                <ul className="mt-[10px] flex flex-col gap-[5px]">
                    <li className="flex items-center gap-[5px]">
                        <Checkbox />
                        <span
                            style={{
                                fontSize: '15px',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                WebkitLineClamp: '1',
                            }}
                        >
                            Example
                        </span>
                    </li>
                </ul>

                <button className="mt-2 text-base text-blue-500" type="button">
                    See more...
                </button>

                <div>
                    <h2>{data?.success}</h2>
                </div>
            </form>
        </div>,
        document.body
    );
};

export default DetailsSelection;
