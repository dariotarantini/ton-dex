import {
  Dispatch,
  SetStateAction,
  Component,
  createRef,
  ReactElement
} from "react";

import './Selector.css';

type Props = {
  options: Array<string | JSX.Element>
  selected: number
  updater: Dispatch<SetStateAction<number>>
}

type State = {
  animating: boolean,
  selectedDimensions: {
    width: number,
    left: number
  }
}

export default class Selector extends Component<Props, State> {
  private selectedRef: React.RefObject<HTMLDivElement>;
  private rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);

    this.selectedRef = createRef<HTMLDivElement>();
    this.rootRef = createRef<HTMLDivElement>();

    this.state = {
      animating: false,
      selectedDimensions: {
        width: 0,
        left: 0
      }
    };
  }

  select(i: number) {
    const selected = this.rootRef.current?.querySelectorAll('.selector__option')[i];

    if (!selected) {
      this.setState({
        selectedDimensions: {
          width: 0,
          left: 0
        }
      });

      return;
    }

    const selectedDimensions = selected.getBoundingClientRect();
    const rootDimensions = this.rootRef.current?.getBoundingClientRect();

    this.setState({
      selectedDimensions: {
        width: selectedDimensions.width,
        left: selectedDimensions.left - (rootDimensions?.left ?? 0)
      }
    });

    if (this.props.selected !== i) this.props.updater(i);
  }

  renderOptions(): ReactElement[] {
    return this.props.options.map((o, i) => (
      <div
        key={i}
        className={
          'selector__option' +
          (typeof o !== 'string' ? ' selector__option--element' : '') +
          (i === this.props.selected ? ' selector__option--selected' : '')
        }
        onClick={() => this.select(i)}
      >{o}</div>
    ));
  }

  componentDidMount() {
    this.select(this.props.selected);
    setTimeout(() => this.setState({ animating: true }));
  }

  componentWillUnmount() {
    this.setState({ animating: false });
  }

  render() {
    return (
      <div
        ref={this.rootRef}
        className={
          "selector" +
          (this.state.animating ? ' selector--animating' : '')
        }
      >
        <div className="selector__options">{this.renderOptions()}</div>
        <div
          ref={this.selectedRef}
          className="selector__selected"
          style={{
            width: this.state.selectedDimensions.width,
            left: this.state.selectedDimensions.left,
          }}
        ></div>
      </div>
    );
  }
}