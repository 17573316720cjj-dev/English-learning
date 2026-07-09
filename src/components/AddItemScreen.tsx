import type React from "react";
import { useState } from "react";
import type { LearningItem, PhraseCategory, PhraseDifficulty } from "../domain";

interface FormState {
  id: string;
  phrase: string;
  meaningZh: string;
  example: string;
  exampleZh: string;
  category: PhraseCategory;
  difficulty: PhraseDifficulty;
}

const emptyForm: FormState = {
  id: "",
  phrase: "",
  meaningZh: "",
  example: "",
  exampleZh: "",
  category: "Daily",
  difficulty: "Basic"
};

function createId(phrase: string): string {
  return `custom-${phrase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}`;
}

export function AddItemScreen({
  items,
  onSave,
  onDelete
}: {
  items: LearningItem[];
  onSave(item: LearningItem): void;
  onDelete(itemId: string): void;
}): React.JSX.Element {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const customItems = items.filter((item) => item.source === "custom");

  const update = <Field extends keyof FormState>(field: Field, value: FormState[Field]): void => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (): void => {
    if (!form.phrase.trim() || !form.meaningZh.trim() || !form.example.trim() || !form.exampleZh.trim()) {
      setError("Please fill in every field.");
      return;
    }

    onSave({
      id: form.id || createId(form.phrase),
      phrase: form.phrase.trim(),
      meaningZh: form.meaningZh.trim(),
      example: form.example.trim(),
      exampleZh: form.exampleZh.trim(),
      category: form.category,
      difficulty: form.difficulty,
      source: "custom"
    });
    setForm(emptyForm);
    setError("");
  };

  const edit = (item: LearningItem): void => {
    setForm({
      id: item.id,
      phrase: item.phrase,
      meaningZh: item.meaningZh,
      example: item.example,
      exampleZh: item.exampleZh,
      category: item.category,
      difficulty: item.difficulty
    });
    setError("");
  };

  return (
    <section className="practice-card">
      <p className="eyebrow">Add</p>
      <h2>Add custom phrase</h2>
      <div className="form-grid">
        <label>
          Phrase
          <input value={form.phrase} onChange={(event) => update("phrase", event.target.value)} />
        </label>
        <label>
          Chinese meaning
          <input value={form.meaningZh} onChange={(event) => update("meaningZh", event.target.value)} />
        </label>
        <label>
          Example sentence
          <textarea value={form.example} onChange={(event) => update("example", event.target.value)} />
        </label>
        <label>
          Chinese example
          <textarea value={form.exampleZh} onChange={(event) => update("exampleZh", event.target.value)} />
        </label>
        <label>
          Category
          <select
            value={form.category}
            onChange={(event) => update("category", event.target.value as PhraseCategory)}
          >
            <option>Basic</option>
            <option>CET</option>
            <option>Speaking</option>
            <option>Writing</option>
            <option>Daily</option>
          </select>
        </label>
        <label>
          Difficulty
          <select
            value={form.difficulty}
            onChange={(event) => update("difficulty", event.target.value as PhraseDifficulty)}
          >
            <option>Basic</option>
            <option>Intermediate</option>
          </select>
        </label>
      </div>
      {error ? <p className="error-message">{error}</p> : null}
      <button className="primary-button" onClick={submit}>
        Save item
      </button>

      <h2 className="section-title">Custom items</h2>
      <div className="item-list">
        {customItems.map((item) => (
          <article className="library-item" key={item.id}>
            <div>
              <h3>{item.phrase}</h3>
              <p>{item.meaningZh}</p>
            </div>
            <div className="row-actions">
              <button className="nav-button" aria-label={`Edit ${item.phrase}`} onClick={() => edit(item)}>
                Edit
              </button>
              <button className="nav-button" aria-label={`Delete ${item.phrase}`} onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
