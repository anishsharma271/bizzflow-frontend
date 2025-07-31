import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser, registerUser, signInUser } from '../../store/auth/authSlice';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '../../services/toast/ToastCenterPopup';

const MobileEntry = ({ setToken }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.authSlice);
    const userData = data?.userData || null;


    const [step, setStep] = useState(1);
    const [pinDigits, setPinDigits] = useState(['', '', '', '']);
    const [confirmpinDigits, setConfrimPinDigits] = useState(['', '', '', '']);
    const pinRefs = useRef([]);
    const confirmpinRefs = useRef([]);

    const schema = yup.object().shape({
        mobile: yup
            .string()
            .required('Mobile number is required')
            .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
        ...(step === 2 && !userData && {
            fullName: yup.string().required('Full name is required'),
            pin: yup.string().required('PIN is required').length(4),
            confirmPin: yup
                .string()
                .required('Confirm PIN is required')
                .oneOf([yup.ref('pin')], 'PINs must match'),
        }),
        ...(step === 2 && userData && {
            pin: yup.string().required('PIN is required').length(4),
        }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            mobile: '',
            fullName: '',
            pin: '',
            confirmPin: '',
        },
        resolver: yupResolver(schema),
    });

    const mobile = watch('mobile');

    const onSubmit = (formData) => {
        if (step === 1) {
            dispatch(checkUser({ mobile: formData.mobile }))
                .unwrap()
                .then((response) => {
                    if (response.success || response.statusCode === 404) {
                        setStep(2);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (step === 2) {
            if (userData) {
                dispatch(signInUser({
                    mobile: formData.mobile,
                    pin: formData.pin,
                })).unwrap()
                    .then((response) => {
                        if (response.success) {
                            setToken(response.data.access_token);
                            navigate('/');
                            showToast({ type: "success", message: response.msg });
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                dispatch(registerUser({
                    mobile: formData.mobile,
                    fullName: formData.fullName,
                    pin: formData.pin,
                    confirmPin: formData.confirmPin,
                })).unwrap()
                    .then((response) => {
                        if (response.success) {
                            setToken(response.data.access_token);
                            navigate('/');
                            showToast({ type: "success", message: response.msg });
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });

            }
        }
    };

    const handleChangeNumber = () => {
        setStep(1);
        setPinDigits(['', '', '', '']);
        setConfrimPinDigits(['', '', '', '']);
        reset({
            mobile: '',
            fullName: '',
            pin: '',
            confirmPin: '',
        });
    };

    const handlePinChange = (e, index, field) => {
        if (field === 'confirmPin') {
            const value = e.target.value.replace(/\D/, '');
            const newDigits = [...confirmpinDigits];
            newDigits[index] = value;
            setConfrimPinDigits(newDigits);

            if (value && index < 3) {
                confirmpinRefs.current[index + 1]?.focus();
            }

            setValue('confirmPin', newDigits.join(''));
        } else {
            const value = e.target.value.replace(/\D/, '');
            const newDigits = [...pinDigits];
            newDigits[index] = value;
            setPinDigits(newDigits);

            if (value && index < 3) {
                pinRefs.current[index + 1]?.focus();
            }

            setValue('pin', newDigits.join(''));
        }
    };

    useEffect(() => {
        if (userData && data.mobile) {
            setValue('mobile', data.mobile);
        }
    }, [userData, data, setValue]);

    const headerText = () => {
        if (step === 1) {
            return `From Supplies to Settlements - All in One Flow <strong style="font-size:1.8rem;font-weight:bold;color:red;">Bizz Flow</strong>`;
        } else if (step === 2 && userData) {
            return `Hi ${userData.full_name}`;
        } else {
            return 'Create your Account';
        }
    };
    return (
        <div
            style={{
                background: 'rgb(237 234 234)',
                minHeight: '60vh',
                width: '70vh',
                marginTop: '10vh',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
                    {step === 1 ? (
                        <>
                            From Supplies to Settlements - All in One Flow:- {' '}
                            <strong style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'red' }}>
                                Bizz Flow
                            </strong>
                        </>
                    ) : step === 2 && userData ? (
                        `Hi ${userData.full_name}`
                    ) : (
                        'Create your Account'
                    )}
                </h2>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
                    {step === 1 ? 'Login/Create Account' : ` ${step === 2 && userData ? `To continue, first verify it's you` : ''}`}
                </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: '400px' }}>
                {step === 1 ? (
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            {...register('mobile')}
                            value={mobile}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setValue('mobile', val);
                            }}
                            maxLength={10}
                            placeholder="Phone Number*"
                            style={{
                                width: '100%',
                                padding: '10px 0px 10px 5px',
                                fontSize: '16px',
                                borderRadius: '6px',
                                border: errors.mobile ? '2px solid red' : '1px solid #ccc',
                            }}
                        />
                        {errors.mobile && (
                            <p style={{ color: 'red', marginTop: '4px' }}>{errors.mobile.message}</p>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', position: 'relative' }}>
                        <input
                            disabled
                            value={mobile}
                            style={{
                                flex: 1,
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '6px',
                                backgroundColor: '#e0e0e0',
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleChangeNumber}
                            style={{
                                padding: '10px 14px',
                                fontSize: '14px',
                                backgroundColor: 'rgb(224, 224, 224)',
                                color: 'red',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'absolute',
                                right: '2px',
                                top: '2px'
                            }}
                        >
                            Change Number
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <>
                        {!userData && (
                            <div style={{ marginBottom: '10px' }}>
                                <input
                                    {...register('fullName')}
                                    placeholder="Full Name*"
                                    style={{ width: '95%', padding: '10px', fontSize: '16px', borderRadius: '6px' }}
                                />
                                {errors.fullName && (
                                    <p style={{ color: 'red' }}>{errors.fullName.message}</p>
                                )}
                            </div>
                        )}

                        {/* PIN Box Input */}
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#000' }}>
                                {userData ? 'Enter PIN' : 'Set PIN'}
                            </label>
                            <div style={{ display: 'flex', gap: '58px' }}>
                                {[0, 1, 2, 3].map((i) => (
                                    <input
                                        key={i}
                                        type="password"
                                        maxLength={1}
                                        value={pinDigits[i]}
                                        onChange={(e) => handlePinChange(e, i, 'pin')}
                                        ref={(el) => (pinRefs.current[i] = el)}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            fontSize: '24px',
                                            textAlign: 'center',
                                            borderRadius: '6px',
                                        }}
                                    />
                                ))}
                            </div>
                            {errors.pin && <p style={{ color: 'red' }}>{errors.pin.message}</p>}
                        </div>

                        {!userData && (
                            // <div style={{ marginBottom: '10px' }}>
                            //     <input
                            //         type="password"
                            //         {...register('confirmPin')}
                            //         placeholder="Confirm PIN*"
                            //         style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px' }}
                            //     />
                            //     {errors.confirmPin && (
                            //         <p style={{ color: 'red' }}>{errors.confirmPin.message}</p>
                            //     )}
                            // </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#000' }}>
                                    Set Confirm PIN
                                </label>
                                <div style={{ display: 'flex', gap: '58px' }}>
                                    {[0, 1, 2, 3].map((i) => (
                                        <input
                                            key={i}
                                            type="password"
                                            maxLength={1}
                                            value={confirmpinDigits[i]}
                                            onChange={(e) => handlePinChange(e, i, 'confirmPin')}
                                            ref={(el) => (confirmpinRefs.current[i] = el)}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                fontSize: '24px',
                                                textAlign: 'center',
                                                borderRadius: '6px',
                                            }}
                                        />
                                    ))}
                                </div>
                                {errors.pin && <p style={{ color: 'red' }}>{errors.pin.message}</p>}
                            </div>
                        )}
                    </>
                )}

                <button
                    type="submit"
                    disabled={step === 1 && mobile?.length !== 10}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '16px',
                        backgroundColor: step === 1 && mobile?.length !== 10 ? 'grey' : '#375',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: '16px',
                    }}
                >
                    {step === 1 ? 'Next' : userData ? 'Login' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default MobileEntry;
