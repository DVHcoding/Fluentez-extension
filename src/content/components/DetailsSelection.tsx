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
import { clamp } from '../../logic/clamp';

interface DetailsProps {
    position: Position;
    selectedText: string;
}

const ModalSize = {
    width: 365,
    height: 330,
} as const;

const DetailsSelection: React.FC<DetailsProps> = ({ position, selectedText }) => {
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
        setVocabulary({ term: '', definition: '' });
        setSelectedVocabulary(null);
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
            const newVocabularies = vocabulariesData.data;

            // Create a set of the current vocabulary IDs to check against
            const existingVocabularyIds = new Set(vocabularies.map((item) => item._id));

            // Filter out vocabularies that are already present in the state
            const uniqueVocabularies = newVocabularies.filter((item) => !existingVocabularyIds.has(item._id));

            if (uniqueVocabularies.length > 0) {
                setVocabularies((prevVocabularies) => [...prevVocabularies, ...uniqueVocabularies]);
            } else {
                console.warn('No new vocabularies to add');
            }
        }
    }, [vocabulariesData]);

    useEffect(() => {
        setVocabulary((preData) => ({ ...preData, term: selectedText }));
    }, [selectedText]);

    useEffect(() => {
        return () => {
            setVocabularies([]);
        };
    }, []);

    const top = clamp(
        position.top - LOGO_CONFIG.OFFSET_TOP - ModalSize.height / 2,
        0,
        window.innerHeight - ModalSize.height / 2 /* fuck you is 1/2f */
    );
    const left = clamp(position.left - ModalSize.width / 2, 0, innerWidth / 2);

    return createPortal(
        <div
            id="Ψdetails"
            style={{
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                transition: `opacity ${LOGO_CONFIG.FADE_DURATION}ms`,
                opacity: 1,
                width: `${ModalSize.width}px`,
                height: `${ModalSize.height}px`,
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                borderRadius: '8px',
                padding: '10px',
                zIndex: '2000',
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
                            value={vocabulary.term}
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
                            value={vocabulary.definition}
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
