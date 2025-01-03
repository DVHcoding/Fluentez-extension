// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Checkbox, Spin } from 'antd';
import TextareaAutosize from 'react-textarea-autosize';
import { LoadingOutlined } from '@ant-design/icons';
import { IoVolumeHighSharp } from 'react-icons/io5';
import { Howl } from 'howler';
import styled from 'styled-components';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import type { Position } from './TextSelection';
import { useGetMeaningWordQuery, useGetVocabulariesByUserIdQuery, useUpdateQuickVocabularyMutation } from '../store/api/userApi';
import styles from './details.module.css';
import { APIResponse, VocabularyData } from '../../content/types/user.api.types';
import { useAsyncMutation } from '../../hooks/useAsyncMutation';
import { toastInfo } from '../../Toast/Toasts';
import { clamp } from '../../logic/clamp';

interface DetailsProps {
    position: Position;
    selectedText: string;
    userDetails: APIResponse | undefined;
}

interface PhoneticButtonProps {
    isActive: boolean;
}

const ModalSize = {
    width: 365,
    height: 330,
} as const;

const DetailsSelection: React.FC<DetailsProps> = ({ position, selectedText, userDetails }) => {
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
    const [freeCount, setFreeCount] = useState<number>(10);

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

    const { data: phonetic } = useGetMeaningWordQuery(selectedText, {
        skip: !selectedText || (userDetails?.user?.isPremium === false && freeCount <= 0),
    });
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
    const PhoneticButton = styled.div<PhoneticButtonProps>`
        display: flex;
        cursor: pointer;
        align-items: center;
        gap: 8px;
        border-radius: 6px;
        padding-block: 0.4rem;
        padding-inline: 0.5rem;
        font-size: 15px;
        border: 1px solid ${(props) => (props.isActive ? '#16a34a' : '#dc2626')};
        color: ${(props) => (props.isActive ? '#16a34a' : '#dc2626')};
        transition: all 0.2s ease-in-out;

        &:hover {
            color: white;
            background-color: ${(props) => (props.isActive ? '#16a34a' : '#dc2626')};
        }
    `;

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

        if (!userDetails?.user?.isPremium && freeCount <= 0) {
            toastInfo('Bạn đã hết lượt dùng thử!');
            return;
        }

        await updateQuickVocabulary({ vocabulary, vocabularyId: selectedVocabulary });
        setVocabulary({ term: '', definition: '' });
        setSelectedVocabulary(null);

        setFreeCount((prevCount) => {
            const newCount = prevCount > 0 ? prevCount - 1 : 0;
            chrome.storage.local.set({ freeCount: newCount }); // Save it to Chrome storage
            return newCount;
        });
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedVocabulary((prev) => (prev === id ? null : id)); // Nếu chọn lại checkbox đã chọn thì bỏ chọn
    };

    const playAudio = useCallback((audioUrl: string) => {
        const sound = new Howl({
            src: [audioUrl],
            html5: true, // Sử dụng HTML5 Audio
            preload: true,
        });
        sound.play();
    }, []);
    // const handleTranslate = async (text: string) => {
    //     const definition = await googleTranslate(text);
    //     setVocabulary({ term: text, definition: definition || '' });
    // };

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
            }
        }
    }, [vocabulariesData]);

    useEffect(() => {
        setVocabulary({ term: selectedText, definition: phonetic?.data?.meaning || '' });
    }, [selectedText, phonetic]);

    useEffect(() => {
        chrome.storage.local.get('freeCount', (result) => {
            if (result.freeCount !== undefined) {
                setFreeCount(result.freeCount);
            } else {
                chrome.storage.local.set({ freeCount: 10 }); // Set default if not found
                setFreeCount(10); // Initialize with 10
            }
        });

        return () => {
            setVocabularies([]);
        };
    }, []);

    // const top = clamp(
    //     position.top - LOGO_CONFIG.OFFSET_TOP - ModalSize.height / 2,
    //     0,
    //     window.innerHeight - ModalSize.height / 2 /* fuck you is 1/2f */
    // );
    const left = clamp(position.left - ModalSize.width / 2, 0, innerWidth / 2);

    return createPortal(
        <div className="extension-root">
            <div
                id="Ψdetails"
                className={styles.scrollbarMess}
                style={{
                    position: 'absolute',
                    top: `${position.top}px`,
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px' }}>
                        <Button type="primary" htmlType="submit" loading={updateQuickVocabularyLoading}>
                            Thêm vào
                        </Button>

                        <PhoneticButton
                            isActive={Boolean(phonetic?.data?.soundUk)}
                            onClick={() => playAudio(phonetic?.data?.soundUk || '')}
                        >
                            <span>UK</span>
                            <IoVolumeHighSharp style={{ color: 'inherit' }} />
                        </PhoneticButton>

                        <PhoneticButton
                            isActive={Boolean(phonetic?.data?.soundUs)}
                            onClick={() => playAudio(phonetic?.data?.soundUs || '')}
                        >
                            <span>US</span>
                            <IoVolumeHighSharp style={{ color: 'inherit' }} />
                        </PhoneticButton>
                    </div>

                    <div className={styles['flex-box']} style={{ marginBottom: '4px' }}>
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
                            <p
                                style={{
                                    fontWeight: '500',
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    marginTop: '3px',
                                    marginBottom: 0,
                                }}
                            >
                                Thuật ngữ
                            </p>
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
                            <p
                                style={{
                                    fontWeight: '500',
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    marginTop: '3px',
                                    marginBottom: 0,
                                }}
                            >
                                Định nghĩa
                            </p>
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
            </div>
        </div>,
        document.body
    );
};

export default DetailsSelection;
