import { GeneratorScreen } from '../../components/generator-screen';
import { GENERATORS } from '../../constants/generators';

export default function TextScreen() {
  return <GeneratorScreen config={GENERATORS.text} />;
}
