import { GeneratorScreen } from '../../components/generator-screen';
import { GENERATORS } from '../../constants/generators';

export default function VideoScreen() {
  return <GeneratorScreen config={GENERATORS.video} />;
}
