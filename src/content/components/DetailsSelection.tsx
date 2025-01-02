// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Checkbox, Spin } from 'antd';
import TextareaAutosize from 'react-textarea-autosize';
import { LoadingOutlined } from '@ant-design/icons';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import type { Position } from './TextSelection';
import { useGetVocabulariesByUserIdQuery, useUpdateQuickVocabularyMutation } from '../store/api/userApi';
import styles from './details.module.css';
import { VocabularyData } from 'content/types/user.api.types';
import { useAsyncMutation } from '../../hooks/useAsyncMutation';
import { toastInfo } from '../../Toast/Toasts';

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
    const [page, setPage] = useState<number>(1);
    const [vocabularies, setVocabularies] = useState<VocabularyData[]>([]);
    const [selectedVocabulary, setSelectedVocabulary] = useState<string | null>(null);
    const [vocabulary, setVocabulary] = useState<{ term: string; definition: string }>({ term: '', definition: '' });

    /* ########################################################################## */
    /*                                     RTK                                    */
    /* ########################################################################## */
    const { data: vocabulariesData, isFetching } = useGetVocabulariesByUserIdQuery(
        { page, limit: 5 },
        {
            // Chức năng: Khi refetchOnReconnect được thiết lập là true, RTK Query sẽ tự động thực hiện lại
            // request để lấy dữ liệu mới từ server nếu kết nối mạng của người dùng bị mất và sau đó được khôi phục.
            // Điều này đảm bảo rằng dữ liệu bạn đang làm việc với là cập nhật nhất có thể.
            refetchOnReconnect: true,
        }
    );
    const [updateQuickVocabulary, updateQuickVocabularyLoading] = useAsyncMutation(useUpdateQuickVocabularyMutation);

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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (vocabulary.definition.trim() === '' || vocabulary.term.trim() === '') {
            toastInfo('Thuật ngữ và định nghĩa không được bỏ trống!');
            return;
        }

        if (!selectedVocabulary) {
            toastInfo('Vui lòng chọn bộ từ vựng để lưu!');
            return;
        }

        await updateQuickVocabulary({ vocabulary, vocabularyId: selectedVocabulary });
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedVocabulary((prev) => (prev === id ? null : id)); // Nếu chọn lại checkbox đã chọn thì bỏ chọn
    };

    /* ########################################################################## */
    /*                                CUSTOM HOOKS                                */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                  useEffect                                 */
    /* ########################################################################## */
    useEffect(() => {
        if (vocabulariesData) {
            const ids = vocabulariesData.data.map((item) => item._id);
            const hasDuplicates = new Set(ids).size !== ids.length;
            if (hasDuplicates) {
                console.warn('Duplicate IDs detected');
            }
            setVocabularies((prevVocabularies) => [...prevVocabularies, ...vocabulariesData.data]);
        }

        return () => {
            setVocabularies([]);
        };
    }, [vocabulariesData]);

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
                background: 'white',
                overflow: 'auto',
            }}
            onMouseUp={(event) => {
                event.stopPropagation();
            }}
        >
            <form className={`${styles.formContainer} ${styles.font_container}`} onSubmit={handleSubmit}>
                <div>
                    <Button type="primary" htmlType="submit" loading={updateQuickVocabularyLoading}>
                        Thêm vào
                    </Button>
                </div>

                <div className={styles['flex-box']}>
                    {/* Left */}
                    <div style={{ width: '100%' }}>
                        <TextareaAutosize
                            className={styles.textarea}
                            maxRows={3}
                            spellCheck={false}
                            maxLength={500}
                            autoFocus
                            required
                            onChange={(e) =>
                                setVocabulary((preData) => ({
                                    ...preData, // Spread the previous state
                                    term: e.target.value, // Update the term
                                }))
                            }
                        />
                        <p style={{ fontWeight: '500', textTransform: 'uppercase', fontSize: '14px', marginTop: '3px' }}>Thuật ngữ</p>
                    </div>

                    {/* Right */}
                    <div style={{ width: '100%' }}>
                        <TextareaAutosize
                            className={styles.textarea}
                            maxRows={3}
                            spellCheck={false}
                            maxLength={500}
                            required
                            onChange={(e) =>
                                setVocabulary((preData) => ({
                                    ...preData,
                                    definition: e.target.value,
                                }))
                            }
                        />
                        <p style={{ fontWeight: '500', textTransform: 'uppercase', fontSize: '14px', marginTop: '3px' }}>Định nghĩa</p>
                    </div>
                </div>

                <ul className={styles.list_items}>
                    {vocabularies.map((items) => (
                        <li key={items._id}>
                            <Checkbox checked={selectedVocabulary === items._id} onChange={() => handleCheckboxChange(items._id)} />
                            <span
                                style={{
                                    fontSize: '15px',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    WebkitLineClamp: '1',
                                }}
                            >
                                {items.title}
                            </span>
                        </li>
                    ))}
                </ul>

                {vocabulariesData?.totalCount &&
                    vocabularies.length < vocabulariesData.totalCount &&
                    (isFetching ? (
                        <Spin indicator={<LoadingOutlined spin />} className="mt-2" />
                    ) : (
                        <p
                            style={{
                                color: 'rgb(59 130 246 / 1)',
                                cursor: 'pointer',
                                marginBlock: '5px',
                                fontSize: '16px',
                                paddingBottom: '15px',
                            }}
                            onClick={() => setPage((prevPage) => prevPage + 1)}
                        >
                            See more...
                        </p>
                    ))}
            </form>
        </div>,
        document.body
    );
};

export default DetailsSelection;
