// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Avatar, Button, Col, Row, Typography } from 'antd';
import { Skeleton } from 'antd';
const { Title, Text } = Typography;

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import Fluentez from '../../assets/Fluentez_Text.webp';
import { UserDetailsType } from '../types/user.api.types';

const Home: React.FC = () => {
    /* ########################################################################## */
    /*                                    HOOKS                                   */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                               REACT ROUTE DOM                              */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                              STATE MANAGEMENT                              */
    /* ########################################################################## */
    const [userDetails, setUserDetails] = useState<UserDetailsType>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [freeCount, setFreeCount] = useState<number>(10);

    /* ########################################################################## */
    /*                                     RTK                                    */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                  VARIABLES                                 */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                             FUNCTION MANAGEMENT                            */
    /* ########################################################################## */
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

    const handleGetUserDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://api.fluentez.com/api/v1/me', {
                withCredentials: true,
            });

            if (data?.user) {
                setUserDetails(data.user);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    /* ########################################################################## */
    /*                                CUSTOM HOOKS                                */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                  useEffect                                 */
    /* ########################################################################## */
    useEffect(() => {
        const initializeApp = async () => {
            setLoading(true); // Set loading state while initializing
            try {
                // Get free count from storage
                chrome.storage.local.get('freeCount', (result) => {
                    if (result.freeCount !== undefined) {
                        setFreeCount(result.freeCount);
                    } else {
                        chrome.storage.local.set({ freeCount: 10 });
                        setFreeCount(10);
                    }
                });

                // Get user details
                await handleGetUserDetails();
            } finally {
                setLoading(false); // Ensure loading is set to false after all initialization
            }
        };

        initializeApp();
    }, []);

    return (
        <div
            style={{
                width: '300px',
                height: '300px',
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                background: 'linear-gradient(135deg, #f1f1f1, #ffffff)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                padding: '20px',
            }}
        >
            <img src={Fluentez} alt="Logo" style={{ width: '30%' }} loading="lazy" />
            {isLoading ? (
                <div style={{ width: '100%' }}>
                    <Skeleton />
                </div>
            ) : !userDetails ? (
                <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#333', textAlign: 'center' }}>
                        Please login to start using Fluentez
                    </h3>
                    <Button type="primary" style={{ width: '100%', marginBottom: '8px' }} onClick={handleLoginClick}>
                        Login
                    </Button>

                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '15px', color: '#555' }}>Don't have an account? </span>
                        <span
                            style={{
                                fontSize: '15px',
                                color: '#1D4ED8',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'color 0.3s ease',
                                cursor: 'pointer',
                            }}
                            onClick={handleSignUpClick}
                        >
                            Sign up
                        </span>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        width: '80%',
                    }}
                >
                    <Row align="middle" gutter={8}>
                        <Col>
                            <Avatar
                                src={<img src={userDetails?.photo?.url} alt="avatar" loading="lazy" referrerPolicy="no-referrer" />}
                                size="large"
                            />
                        </Col>
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>
                                {userDetails?.username}
                            </Title>
                        </Col>
                    </Row>

                    <Row align="middle" style={{ marginTop: '8px' }} gutter={[4, 0]}>
                        <Col>
                            <Text strong style={{ fontSize: '18px', fontWeight: '500' }}>
                                Account Plan:
                            </Text>
                        </Col>
                        <Col>
                            <Text style={{ color: '#e49826', fontSize: '18px', fontWeight: '500' }}>
                                {userDetails?.isPremium ? 'Premium' : 'Free'}
                            </Text>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '8px' }}>
                        <Col>
                            <Text strong style={{ fontSize: '18px', fontWeight: '500' }}>
                                Free count: {userDetails?.isPremium ? ' Unlimited' : freeCount}
                            </Text>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default Home;
