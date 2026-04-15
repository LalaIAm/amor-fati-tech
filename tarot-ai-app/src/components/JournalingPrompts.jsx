import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePromptResponse } from "../store/journalSlice.js";

/**
 * JournalingPrompts — displays three AI-generated journaling prompts.
 * Clicking a prompt expands an inline textarea pre-populated with the prompt
 * text (or the existing saved response). On blur, dispatches savePromptResponse.
 *
 * Requirements: 8.2, 8.3, 8.4
 */
export default function JournalingPrompts({ entryId }) {
  const dispatch = useDispatch();
  const selectedEntry = useSelector((state) => state.journal.selectedEntry);

  const prompts = selectedEntry?.journalingPrompts ?? [];
  const promptResponses = selectedEntry?.promptResponses ?? {};

  // Track which prompt index is currently expanded (null = none)
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Local textarea values keyed by prompt index
  const [localValues, setLocalValues] = useState({});

  // Sync local values when selectedEntry changes (e.g. navigating to a different entry)
  useEffect(() => {
    const responses = selectedEntry?.promptResponses ?? {};
    const prompts = selectedEntry?.journalingPrompts ?? [];
    const initial = {};
    prompts.forEach((prompt, i) => {
      // Pre-populate with saved response if it exists, otherwise use the prompt text
      initial[i] = responses[i] ?? prompt;
    });
    setLocalValues(initial);
    setExpandedIndex(null);
  }, [selectedEntry?.id]);

  function handlePromptClick(index) {
    if (expandedIndex === index) return; // already expanded
    setExpandedIndex(index);
    // Ensure local value is initialised for this index
    setLocalValues((prev) => {
      if (prev[index] !== undefined) return prev;
      return {
        ...prev,
        [index]: promptResponses[index] ?? prompts[index] ?? "",
      };
    });
  }

  function handleChange(index, value) {
    setLocalValues((prev) => ({ ...prev, [index]: value }));
  }

  function handleBlur(index) {
    if (!entryId) return;
    dispatch(
      savePromptResponse({
        id: entryId,
        promptIndex: index,
        response: localValues[index] ?? "",
      }),
    );
  }

  if (prompts.length === 0) return null;

  return (
    <div className="journaling-prompts">
      <h3 className="journaling-prompts__heading">Journaling Prompts</h3>
      <ol className="journaling-prompts__list">
        {prompts.map((prompt, index) => (
          <li key={index} className="journaling-prompts__item">
            {expandedIndex === index ? (
              <div className="journaling-prompts__expanded">
                <p className="journaling-prompts__prompt-text">{prompt}</p>
                <textarea
                  className="journaling-prompts__textarea"
                  value={localValues[index] ?? prompt}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onBlur={() => handleBlur(index)}
                  rows={5}
                  aria-label={`Response to prompt ${index + 1}: ${prompt}`}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
              </div>
            ) : (
              <button
                type="button"
                className="journaling-prompts__prompt-btn"
                onClick={() => handlePromptClick(index)}
                aria-expanded={false}
                aria-label={`Expand prompt ${index + 1}: ${prompt}`}
              >
                {prompt}
                {promptResponses[index] && (
                  <span
                    className="journaling-prompts__saved-badge"
                    aria-label="Response saved"
                  >
                    ✓
                  </span>
                )}
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
