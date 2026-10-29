import { GeneratorScreen } from '../../components/generator-screen';
import { GENERATORS } from '../../constants/generators';

export default function PdfScreen() {
  return <GeneratorScreen config={GENERATORS.pdf} />;
}
