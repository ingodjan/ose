/**
 * @file A class representing the "Detailed" encumbrance scheme from Old School Essentials: Classic Fantasy
 */
import OseDataModelCharacterEncumbrance, {
  CharacterEncumbrance,
} from "./data-model-character-encumbrance";

// import { OSE } from '../../config';

/**
 * @todo Add template path for encumbrance bar
 * @todo Add template path for inventory item row
 */
export default class OseDataModelCharacterEncumbranceDetailed
  extends OseDataModelCharacterEncumbrance
  implements CharacterEncumbrance
{
  static templateEncumbranceBar = "";

  static templateInventoryRow = "";

   static encumbranceStepsDetailed = {
    quarter: 25,
    threeEighths: 37.5,
    half: 50
  };

  /**
   * The machine-readable label for this encumbrance scheme
   */
  static type = "detailed";

  /**
   * The human-readable label for this encumbrance scheme
   */
  static localizedLabel = "OSE.Setting.EncumbranceDetailed";

  /**
   * The weight (in coins) to add to the total weight value if the character has adventuring gear
   */
  static gearWeight = 80;

  #weight = 0;

  #hasAdventuringGear;

  constructor(
    max = OseDataModelCharacterEncumbrance.baseEncumbranceCap,
    items: Item[] = []
  ) {
    super(OseDataModelCharacterEncumbranceDetailed.type, max);
    this.#hasAdventuringGear = items.some(
      (i: Item) => i.type === "item" && !i.system.treasure
    );
    this.#weight =
      items.reduce(
        (acc, { type, system: { treasure, quantity, weight } }: Item) => {
          if (type === "spell" || type === "ability") return acc;

          let value = acc;

          if (type === "item" && treasure) value += quantity.value * weight;
          if (["weapon", "armor", "container"].includes(type)) value += weight;

          return value;
        },
        0
      ) +
      (this.#hasAdventuringGear
        ? OseDataModelCharacterEncumbranceDetailed.gearWeight
        : 0);
  }

  // eslint-disable-next-line class-methods-use-this
  get steps() {
    return Object.values(OseDataModelCharacterEncumbranceDetailed.encumbranceStepsDetailed);
  }

  get value(): number {
    return this.#weight;
  }
}
