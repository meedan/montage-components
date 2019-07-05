import shortid from 'shortid';
import XRegExp from 'xregexp';

// import yt from './9G8dmsnFjL4.srv3.json';
// import ytEs from './9G8dmsnFjL4.srv3.es.json';
import sm from './9G8dmsnFjL4.speechmatics.json';

const generateID = () => {
  let id = null;
  do {
    id = shortid.generate();
  } while (!id.match(/^[a-z]([0-9]|[a-z])+([0-9a-z]+)[a-z]$/i));

  return id;
};

const transformTimings = array =>
  array.map(element => {
    const { time, duration } = element;
    const start = parseFloat(time) * 1e3;
    const end = start + 1e3 * parseFloat(duration);

    delete(element.time);
    delete(element.duration);
    delete(element.confidence);

    return { ...element, start, end };
  });

const unicodePunctuation = XRegExp('^\\p{P}+$');

const convertSpeechmatics = ({ speakers, words, job: metadata }) => {
  const fixedWords = transformTimings(
    words.reduce((acc, word) => {
      if (unicodePunctuation.test(word.name.trim())) {
        const pword = acc.pop();
        pword.name = pword.name.trimEnd().concat(word.name.trim());
        return [...acc, pword];
      }

      return [...acc, word];
    }, [])
  );

  return {
    title: metadata.name,
    language: metadata.lang,
    segments: transformTimings(speakers).map(({ start, end, name }) => {
      const words = fixedWords
        .filter(
          word =>
            start <= word.start &&
            word.start < end &&
            start < word.end &&
            word.end <= end
        )
        .map(({ start, end, name }) => ({
          id: generateID(),
          start,
          end,
          text: name.trim(),
        }));

      return {
        id: generateID(),
        speaker: name,
        start,
        end,
        text: words.map(({ text }) => text).join(' '),
        words: words.map((word, index) => ({
          ...word,
          offset:
            index > 0
              ? words
                  .slice(0, index)
                  .map(({ text }) => text)
                  .join(' ').length + 1
              : 0,
          length: word.text.length,
        })),
      };
    }),
  };
};
const transcripts = [
  convertSpeechmatics(sm),
];

console.log(transcripts);
export default transcripts;
