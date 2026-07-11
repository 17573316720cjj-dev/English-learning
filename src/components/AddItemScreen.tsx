import type React from "react";
import { useState } from "react";
import type { LearningItem, PhraseCategory, PhraseDifficulty } from "../domain";
import { categoryLabels, difficultyLabels } from "../lib/labels";

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
      setError("请填写所有字段。");
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
      <p className="eyebrow">添加</p>
      <h2>添加自定义短语</h2>
      <div className="form-grid">
        <label>
          英文短语
          <input value={form.phrase} onChange={(event) => update("phrase", event.target.value)} />
        </label>
        <label>
          中文释义
          <input value={form.meaningZh} onChange={(event) => update("meaningZh", event.target.value)} />
        </label>
        <label>
          英文例句
          <textarea value={form.example} onChange={(event) => update("example", event.target.value)} />
        </label>
        <label>
          中文例句
          <textarea value={form.exampleZh} onChange={(event) => update("exampleZh", event.target.value)} />
        </label>
        <label>
          分类
          <select
            value={form.category}
            onChange={(event) => update("category", event.target.value as PhraseCategory)}
          >
            <option value="Basic">{categoryLabels.Basic}</option>
            <option value="CET">{categoryLabels.CET}</option>
            <option value="Speaking">{categoryLabels.Speaking}</option>
            <option value="Writing">{categoryLabels.Writing}</option>
            <option value="Daily">{categoryLabels.Daily}</option>
          </select>
        </label>
        <label>
          难度
          <select
            value={form.difficulty}
            onChange={(event) => update("difficulty", event.target.value as PhraseDifficulty)}
          >
            <option value="Basic">{difficultyLabels.Basic}</option>
            <option value="Intermediate">{difficultyLabels.Intermediate}</option>
          </select>
        </label>
      </div>
      {error ? <p className="error-message">{error}</p> : null}
      <button className="primary-button" onClick={submit}>
        保存条目
      </button>

      <h2 className="section-title">自定义内容</h2>
      <div className="item-list">
        {customItems.map((item) => (
          <article className="library-item" key={item.id}>
            <div>
              <h3>{item.phrase}</h3>
              <p>{item.meaningZh}</p>
            </div>
            <div className="row-actions">
              <button className="nav-button" aria-label={`编辑 ${item.phrase}`} onClick={() => edit(item)}>
                编辑
              </button>
              <button className="nav-button" aria-label={`删除 ${item.phrase}`} onClick={() => onDelete(item.id)}>
                删除
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
