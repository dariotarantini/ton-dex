import './Menu.css';

type props = {
  items: {
    title: string
    danger?: boolean
    action: () => void
  }[]
};

export default function Menu({ items }: props) {
  const renderItems = () => items.map((item, i) => (
    <div
      key={i}
      onClick={item.action}
      className={
        'menu__item' +
        (item.danger ? ' menu__item--danger' : '')
      }
    >{item.title}</div>
  ));

  return (
    <div className="menu popup_shadow border_separator">
      {renderItems()}
    </div>
  );
}