import extractText from './utils/extractText.js';

const runTest = async () => {
    const text = await extractText('./test/data/05-versions-space.pdf', 'application/pdf');
    console.log(text);
};

runTest();