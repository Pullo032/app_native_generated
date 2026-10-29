import { GeneratorScreen } from '../../../components/generator-screen';
import { GENERATORS } from '../../../constants/generators';

export default function PhotoScreen() {
  return <GeneratorScreen config={GENERATORS.photo} />;
}
