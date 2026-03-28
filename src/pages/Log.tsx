import { useEffect, useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  createPeriodLog,
  updatePeriodLog,
  type PeriodLogSectionEntry,
} from '../utils/periodLogs';
import { useToast } from '../components/ui-kit/ToastProvider';
import { Loader } from '../components/ui-kit/Loader';
import { useNavbarVisibility } from '../context/NavbarVisibilityContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTodayPeriodLog } from '../store/appDataSlice';

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

function buildPrefillFromSavedSections(
  savedSections: PeriodLogSectionEntry[]
): {
  selectedBySection: Record<string, Set<string>>;
  customOptionsBySection: Record<string, CustomOption[]>;
} {
  const knownTitles = new Set(LOG_SECTIONS.map((s) => s.title));
  const presetLabelsByTitle = new Map(
    LOG_SECTIONS.map((s) => [s.title, new Set(s.options)] as const)
  );

  const selectedBySection: Record<string, Set<string>> = {};
  const customOptionsBySection: Record<string, CustomOption[]> = {};

  for (const saved of savedSections) {
    if (!knownTitles.has(saved.sectionTitle)) {
      continue;
    }

    const presetLabels = presetLabelsByTitle.get(saved.sectionTitle)!;
    const customs: CustomOption[] = (saved.customOptions ?? []).map((label, index) => ({
      id: `custom-restore-${saved.sectionTitle}-${index}-${Math.random().toString(36).slice(2, 11)}`,
      label,
      isEditing: false,
    }));
    customOptionsBySection[saved.sectionTitle] = customs;

    const selected = new Set<string>();
    for (const label of saved.selectedOptions ?? []) {
      if (presetLabels.has(label)) {
        selected.add(`preset-${label}`);
        continue;
      }
      const match = customs.find((c) => c.label === label);
      if (match) {
        selected.add(match.id);
      }
    }
    selectedBySection[saved.sectionTitle] = selected;
  }

  return { selectedBySection, customOptionsBySection };
}

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
        ? 'border-[#33B1FF] bg-[#33B1FF] text-white'
        : 'border-[#33B1FF] bg-white text-[#33B1FF]'
        }`}
      type="button"
    >
      {label}
    </button>
  );
}

export default function Log() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const todayPeriodLog = useAppSelector((s) => s.appData.todayPeriodLog);
  const { showToast } = useToast();
  const { hideNavbar, showNavbar } = useNavbarVisibility();
  const [selectedBySection, setSelectedBySection] = useState<Record<string, Set<string>>>({});
  const [customOptionsBySection, setCustomOptionsBySection] = useState<Record<string, CustomOption[]>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [editingTodayLogId, setEditingTodayLogId] = useState<string | null>(null);

  useEffect(() => {
    hideNavbar();

    return () => {
      showNavbar();
    };
  }, [hideNavbar, showNavbar]);

  useEffect(() => {
    if (todayPeriodLog) {
      const { selectedBySection: sel, customOptionsBySection: customs } =
        buildPrefillFromSavedSections(todayPeriodLog.sections);
      setSelectedBySection(sel);
      setCustomOptionsBySection(customs);
      setEditingTodayLogId(todayPeriodLog.id);
    } else {
      setSelectedBySection({});
      setCustomOptionsBySection({});
      setEditingTodayLogId(null);
    }
  }, [todayPeriodLog]);

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
      if (editingTodayLogId) {
        await updatePeriodLog(editingTodayLogId, { sections });
        dispatch(setTodayPeriodLog({ id: editingTodayLogId, sections }));
        showToast('Day updated queen, slay!.', 'success');
      } else {
        const id = await createPeriodLog({ sections });
        dispatch(setTodayPeriodLog({ id, sections }));
        showToast('Day logged queen, slay!.', 'success');
      }
      navigate('/home');
    } catch (error) {
      console.error('Failed to save period log:', error);
      showToast('ooopsies.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const isUpdateMode = Boolean(editingTodayLogId);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#FFE9E5]">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain">
        <header className="sticky top-0 z-10 flex w-full min-w-0 shrink-0 items-center justify-between border-b border-black/[0.06] bg-[#FFF0ED]/60 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-2xl font-semibold leading-[1] text-[#111111]">
            {isUpdateMode ? 'Update your day' : 'Log Your Day'}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B7B7B7] text-white"
            aria-label="Close"
            type="button"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex flex-col gap-6 px-6 pb-6 pt-6">
          {mergedSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-[#111111] mb-3 ml-3">{section.title}</h2>
              <div className="flex flex-wrap gap-3 rounded-3xl bg-[#FFD7D7] p-4">
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
                      className="min-w-[120px] rounded-full border border-[#33B1FF] bg-white px-4 py-1 text-sm font-semibold text-[#33B1FF] outline-none"
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
                  className="flex items-center gap-1 rounded-full border border-dashed border-[#33B1FF] bg-white px-4 py-1 text-sm font-semibold text-[#33B1FF] transition-colors hover:bg-[#EAF8FF]"
                >
                  <PlusCircle size={16} strokeWidth={2} />
                  Add
                </button>
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="shrink-0 px-6 pb-8 pt-8">
        <button
          onClick={handleSaveLog}
          disabled={isSaving}
          className={`flex w-full max-w-[22rem] items-center justify-center rounded-full bg-[#FF6961] px-12 py-2 text-lg font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${!buildPeriodLogSections().some((section) => section.selectedOptions.length > 0) ? 'cursor-not-allowed opacity-20' : ''}`}
          type="button"
        >
          {isSaving ? (
            <Loader withCard={false} size="compact" label="Saving" labelClassName="text-white" />
          ) : isUpdateMode ? (
            'Update your day'
          ) : (
            'Log Your Day'
          )}
        </button>
      </div>
    </div>
  );
}
