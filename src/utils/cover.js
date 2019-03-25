import img01 from '../assets/stephan-valentin-345970-unsplash.png';
import img02 from '../assets/henry-co-481270-unsplash.png';
import img03 from '../assets/henry-co-503344-unsplash.png';

export default function cover(name) {
  if (name.length < 12) {
    return img01;
  } else if (name.length < 14) {
    return img02;
  } else {
    return img03;
  }
}
