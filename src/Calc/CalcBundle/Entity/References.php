<?php
namespace Calc\CalcBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="options")
 */
class References
{

    const FIELDS = [
        'id',
        'name',
        'unit',
        'currency',
        'categories',
        'required',
        'elements',
        'price_dry',
        'price_wet',
        'price_formula',
        'amount_formula'
    ];

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="float")
     */
    protected $price_dry = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $price_wet = 0;

    /**
     * @ORM\Column(type="string")
     */
    protected $unit = 'р';

    /**
     * @ORM\Column(type="string")
     */
    protected $currency = '';

    /**
     * @ORM\Column(type="string")
     */
    protected $categories = '';

    /**
     * @ORM\Column(type="integer", length=1)
     */
    protected $required = 0;

    /**
     * @ORM\Column(type="string")
     */
    protected $elements = '';

    /**
     * @ORM\Column(type="string")
     */
    protected $price_formula = 0;

    /**
     * @ORM\Column(type="string")
     */
    protected $amount_formula = 0;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId():int
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return References
     */
    public function setName(string $name):References
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName():string
    {
        return $this->name;
    }

    /**
     * Set price
     *
     * @param float $price
     * @return References
     */
    public function setPriceDry(float $price):References
    {
        $this->price_dry = $price;

        return $this;
    }

    /**
     * Get price
     *
     * @return float 
     */
    public function getPriceDry():float
    {
        return $this->price_dry;
    }

    /**
     * Set price
     *
     * @param float $price
     * @return References
     */
    public function setPriceWet(float $price):References
    {
        $this->price_wet = $price;

        return $this;
    }

    /**
     * Get price
     *
     * @return float
     */
    public function getPriceWet():float
    {
        return $this->price_wet;
    }

    /**
     * Set unit
     *
     * @param string $unit
     * @return References
     */
    public function setUnit(string $unit):References
    {
        $this->unit = $unit;

        return $this;
    }

    /**
     * Get unit
     *
     * @return string 
     */
    public function getUnit():string
    {
        return $this->unit;
    }

    /**
     * Set currency
     *
     * @param string $currency
     * @return References
     */
    public function setCurrency(string $currency):References
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * Get currency
     *
     * @return string 
     */
    public function getCurrency():string
    {
        return $this->currency;
    }

    /**
     * Set categories
     *
     * @param string $categories
     * @return References
     */
    public function setCategories(string $categories):References
    {
        $this->categories = $categories;

        return $this;
    }

    /**
     * Get categories
     *
     * @return string 
     */
    public function getCategories():string
    {
        return $this->categories;
    }

    /**
     * Set required
     *
     * @param integer $required
     * @return References
     */
    public function setRequired(int $required):References
    {
        $this->required = $required;

        return $this;
    }

    /**
     * Get required
     *
     * @return integer 
     */
    public function getRequired():int
    {
        return $this->required;
    }

    /**
     * Set elements
     *
     * @param string $elements
     * @return References
     */
    public function setElements(string $elements):References
    {
        $this->elements = $elements;

        return $this;
    }

    /**
     * Get elements
     *
     * @return string 
     */
    public function getElements():string
    {
        return $this->elements;
    }

    /**
     * Set price_formula
     *
     * @param price_formula
     * @return References
     */
    public function setPriceFormula(float $price_formula):References
    {
        $this->price_formula = $price_formula;

        return $this;
    }

    /**
     * Get price_formula
     *
     * @return string
     */

    public function getPriceFormula():float
    {
        return $this->price_formula;
    }

    /**
     * Set amount_formula
     *
     * @param amount_formula
     * @return References
     */
    public function setAmountFormula(float $amount_formula):References
    {
        $this->amount_formula = $amount_formula;

        return $this;
    }

    /**
     * Get amount_formula
     *
     * @return string
     */

    public function getAmountFormula():float
    {
        return $this->amount_formula;
    }

    public function getFields(array $fields = self::FIELDS):array
    {
        $result = [];
        foreach($fields as $value) {
            if (property_exists($this, $value)) {
                $result[$value] = $this->$value ?? null;
            }
        }

        return $result;
    }
}
