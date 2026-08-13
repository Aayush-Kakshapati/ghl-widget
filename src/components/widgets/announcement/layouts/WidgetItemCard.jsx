function WidgetItemCard({ item }) {
  return (
    <div className="ghl-widget-item">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          width="50"
          height="50"
          style={{ borderRadius: "6px", objectFit: "cover" }}
        />
      )}

      <div>
        <strong>{item.title}</strong>
        {item.subtitle && <div>{item.subtitle}</div>}
      </div>
    </div>
  );
}

export default WidgetItemCard;
