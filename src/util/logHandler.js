const errorHandler = (message) => {
    if (import.meta.env.DEV) { console.error("[Error]: ", message) }
}

const infoHandler = (message) => {
    if (import.meta.env.DEV) { console.info("[Info]: ", message) }
}

const logging = {
    errorHandler,
    infoHandler
}

export default logging