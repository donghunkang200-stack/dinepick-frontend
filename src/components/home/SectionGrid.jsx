import "./SectionGrid.css";

const SAMPLE = [
  {
    title: "부제목",
    desc: "부제목에 넣고 싶은 내용을 추가하는 본문 텍스트.",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "부제목",
    desc: "요점에 추가하고 싶은 내용을 적을 수 있는 본문 텍스트.",
    img: "https://images.unsplash.com/photo-1528826194825-8d3b4ee31c06?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "부제목",
    desc: "더 공감하고 싶은 내용을 적을 수 있는 본문 텍스트.",
    img: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function SectionGrid({ title }) {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>

        <div className="grid">
          {SAMPLE.map((item, i) => (
            <article key={i} className="card">
              <div className="card-img">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="card-body">
                <div className="card-title">{item.title}</div>
                <div className="card-desc">{item.desc}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
