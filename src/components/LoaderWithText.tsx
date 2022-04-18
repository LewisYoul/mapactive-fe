// @ts-ignore
import Loader from '../assets/loader.svg?component';

type LoaderWithTextProps = {
  text: string;
  width: number;
  height: number;
}

export default function LoaderWithText(props: LoaderWithTextProps) {
  const { text, width, height } = props;

  return(
    <div className="flex flex-col justify-center h-full">
      <div className="h-36 text-center">
        <Loader width={width} height={height} />
        <span className="mt-3 block text-gray-700">{text}</span>
      </div>
    </div>
  )
}
