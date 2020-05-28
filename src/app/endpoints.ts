const Endpoints = {
    login : {
        otp: {
            send : {
                method: 'POST',
                url: 'sendOtp'
            },
            resend: {
                method: 'POST',
                url: 'resendOtp'
            },
            verify: {
                method: 'POST',
                url: 'verifyOtp'
            }
        },
        checkMobile: {
            method: 'POST',
            url: 'checkUserStatusByMobile'
        }
    }

};

export default Endpoints;