export const SaveProcess = () => {
    process.on('unhandledRejection', (reason, promsise) => {
        console.log(reason, promsise);
    });

    process.on('uncaughtException', (reason, promsise) => {
        console.log(reason, promsise);
    });
};
