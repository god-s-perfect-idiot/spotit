import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPeriodLog } from '../utils/periodLogs';
import { useToast } from '../components/ui-kit/ToastProvider';

type LogSection = {
  title: string;
  options: string[];
};

type CustomOption = {
  id: string;
  label: string;
  isEditing: boolean;
};

type MergedOption = {
  id: string;
  label: string;
  isEditing: boolean;
};

type MergedSection = {
  title: string;
  options: MergedOption[];
};

const LOG_SECTIONS: LogSection[] = [
  {
    title: 'Vaginal Discharge',
    options: [
      'No Discharge',
      'Clear',
      'White',
      'Watery',
      'Egg White',
      'Gray',
      'Cloudy',
      'Yellow',
      'Green',
      'Creamy',
      'Clumpy White',
      'Brown',
      'Pink',
      'No Smell',
      'Fishy Smell',
    ],
  },
  {
    title: 'Physical Symptoms',
    options: [
      'No Symptoms',
      'Tender Breasts',
      'Headache',
      'Backache',
      'Bloating',
      'Nausea',
      'Acne',
      'Vaginal Dryness',
      'Clear Skin',
      'Fatigue',
      'Cramps',
      'Vaginal Itching',
      'Acid',
    ],
  },
  {
    title: 'Sleep',
    options: ['0-3 Hours', '4-6 Hours', '7-9 Hours', '9+ Hours'],
  },
  {
    title: 'Physical Activity',
    options: [
      'Rest Day',
      'Walking',
      'Jogging',
      'Running',
      'Yoga',
      'HIIT',
      'Weightlifting',
      'Pilates',
      'Dancing',
      'Household Chores',
      'Stretching',
      'Cycling',
      'Swimming',
      'Hiking',
      'Sports',
    ],
  },
  {
    title: 'Nutrition',
    options: [
      'Well Hydrated',
      'Balanced Meals',
      'Cravings',
      'Skipped Meals',
      'Had Caffeine',
      'Had Alcohol',
    ],
  },
  {
    title: 'Libido & Sexual Activity',
    options: [
      'High Sex Drive',
      'Low Sex Drive',
      'Natural Sex Drive',
      'Protected Sex',
      'Unprotected Sex',
      'Oral Sex',
      'Anal Sex',
      'Masturbation',
    ],
  },
  {
    title: "Life Factors",
    options: [
      'Stress',
      'Travel',
      'Illness'
    ],
  },
  {
    title: "Tests & Health Checks",
    options: [
      'Log Pregnancy Test',
      'Log Ovulation Test',
      'Log UTI Test',
      'Log Health Appointment',
    ]
  },
  {
    title: "Contraception",
    options: [
      'Pill Taken',
      'Forgot Pill',
      'Took Pill Late',
    ],
  },
];

function Chip({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1 text-sm font-semibold transition-colors ${isSelected
        ? 'bg-[#33B1FF] text-white border-[#33B1FF]'
        : 'bg-white text-[#33B1FF] border-[#33B1FF]'
        }`}
      type="button"
    >
      {label}
    </button>
  );
}

export default function Log() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedBySection, setSelectedBySection] = useState<Record<string, Set<string>>>({});
  const [customOptionsBySection, setCustomOptionsBySection] = useState<Record<string, CustomOption[]>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleOption = (sectionTitle: string, optionId: string) => {
    setSelectedBySection((prev) => {
      const current = prev[sectionTitle] ?? new Set<string>();
      const next = new Set(current);

      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }

      return {
        ...prev,
        [sectionTitle]: next,
      };
    });
  };

  const addCustomOption = (sectionTitle: string) => {
    setCustomOptionsBySection((prev) => {
      const existing = prev[sectionTitle] ?? [];
      return {
        ...prev,
        [sectionTitle]: [
          ...existing,
          {
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            label: '',
            isEditing: true,
          },
        ],
      };
    });
  };

  const updateCustomOptionLabel = (sectionTitle: string, optionId: string, label: string) => {
    setCustomOptionsBySection((prev) => ({
      ...prev,
      [sectionTitle]: (prev[sectionTitle] ?? []).map((option) =>
        option.id === optionId ? { ...option, label } : option
      ),
    }));
  };

  const finalizeCustomOption = (sectionTitle: string, optionId: string) => {
    setCustomOptionsBySection((prev) => {
      const current = prev[sectionTitle] ?? [];
      const target = current.find((option) => option.id === optionId);

      if (!target) {
        return prev;
      }

      const normalizedLabel = target.label.trim();

      if (!normalizedLabel) {
        return {
          ...prev,
          [sectionTitle]: current.filter((option) => option.id !== optionId),
        };
      }

      return {
        ...prev,
        [sectionTitle]: current.map((option) =>
          option.id === optionId ? { ...option, label: normalizedLabel, isEditing: false } : option
        ),
      };
    });
  };

  const mergedSections: MergedSection[] = LOG_SECTIONS.map((section) => {
    const presetOptions: MergedOption[] = section.options.map((option) => ({
      id: `preset-${option}`,
      label: option,
      isEditing: false,
    }));
    const customOptions: MergedOption[] = (customOptionsBySection[section.title] ?? []).map(
      (option) => ({
        id: option.id,
        label: option.label,
        isEditing: option.isEditing,
      })
    );

    return {
      title: section.title,
      options: [...presetOptions, ...customOptions],
    };
  });

  const buildPeriodLogSections = (): { sectionTitle: string; selectedOptions: string[]; customOptions: string[] }[] =>
    mergedSections.map((section) => {
      const selectedIds = selectedBySection[section.title] ?? new Set<string>();
      const selectedOptions = section.options
        .filter((option) => !option.isEditing && selectedIds.has(option.id))
        .map((option) => option.label.trim())
        .filter(Boolean);

      const customOptions = (customOptionsBySection[section.title] ?? [])
        .filter((option) => !option.isEditing)
        .map((option) => option.label.trim())
        .filter(Boolean);

      return {
        sectionTitle: section.title,
        selectedOptions,
        customOptions,
      };
    });

  const handleSaveLog = async () => {
    const sections = buildPeriodLogSections();
    const hasAtLeastOneSelection = sections.some((section) => section.selectedOptions.length > 0);

    if (!hasAtLeastOneSelection) {
      showToast('Please select at least one option before logging your day.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await createPeriodLog({
        sections,
      });
      showToast('Your log has been saved successfully.', 'success');
      navigate('/home');
    } catch (error) {
      console.error('Failed to save period log:', error);
      showToast('Could not save your log right now. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-[#FFE9E5] px-6 pt-8 pb-28 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl leading-[1] font-semibold text-[#111111] ml-3">Log Your Day</h1>
        <button
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full bg-[#B7B7B7] text-white flex items-center justify-center"
          aria-label="Close"
          type="button"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {mergedSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-[#111111] mb-3 ml-3">{section.title}</h2>
            <div className="rounded-3xl bg-[#FFD7D7] p-4 flex flex-wrap gap-3">
              {section.options.map((option) =>
                option.isEditing ? (
                  <input
                    key={option.id}
                    autoFocus
                    type="text"
                    value={option.label}
                    onChange={(event) =>
                      updateCustomOptionLabel(section.title, option.id, event.target.value)
                    }
                    onBlur={() => finalizeCustomOption(section.title, option.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        finalizeCustomOption(section.title, option.id);
                      }
                      if (event.key === 'Escape') {
                        updateCustomOptionLabel(section.title, option.id, '');
                        finalizeCustomOption(section.title, option.id);
                      }
                    }}
                    className="rounded-full border border-[#33B1FF] bg-white px-4 py-1 text-sm font-semibold text-[#33B1FF] outline-none min-w-[120px]"
                    placeholder="Type custom..."
                  />
                ) : (
                  <Chip
                    key={option.id}
                    label={option.label}
                    isSelected={selectedBySection[section.title]?.has(option.id) ?? false}
                    onClick={() => toggleOption(section.title, option.id)}
                  />
                )
              )}
              <button
                type="button"
                onClick={() => addCustomOption(section.title)}
                className="rounded-full border border-dashed border-[#33B1FF] bg-white px-4 py-1 text-sm font-semibold text-[#33B1FF] transition-colors hover:bg-[#EAF8FF] flex items-center gap-1"
              >
                <PlusCircle size={16} />
                Add
              </button>
            </div>
          </section>
        ))}
      </div>
      <button
        onClick={handleSaveLog}
        disabled={isSaving}
        className={`mt-4 w-full bg-[#FF6961] text-white font-bold text-lg py-2 px-12 max-w-[22rem] rounded-full shadow-md mt-2 mb-4 disabled:opacity-60 disabled:cursor-not-allowed ${!buildPeriodLogSections().some((section) => section.selectedOptions.length > 0) ? 'opacity-20 cursor-not-allowed' : ''}`}
        type="button"
      >
        {isSaving ? 'Saving...' : 'Log Your Day'}
      </button>
    </div>
  );
}
