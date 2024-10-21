function resObject(isSuccess, {...arg}) {
    return {
        success: isSuccess,
        ...arg
    }
}

export default resObject;