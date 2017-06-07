<?php
namespace Calc\ApiBundle\Entity;
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
        'price',
        'unit',
        'price_formula',
        'amount_formula',
        'currency',
        'categories',
        'required'
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
    protected $price = 0;

    /**
     * @ORM\Column(type="string")
     */
    protected $unit = 'р';

    /**
     * @ORM\Column(type="string")
     */
    protected $amount_formula = '';

    /**
     * @ORM\Column(type="string")
     */
    protected $price_formula = '';

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
    public function setPrice(float $price):References
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Get price
     *
     * @return float 
     */
    public function getPrice():float
    {
        return $this->price;
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
     * Set amount_formula
     *
     * @param string $amountFormula
     * @return References
     */
    public function setAmountFormula(string $amountFormula):References
    {
        $this->amount_formula = $amountFormula;

        return $this;
    }

    /**
     * Get amount_formula
     *
     * @return string 
     */
    public function getAmountFormula():string
    {
        return $this->amount_formula;
    }

    /**
     * Set price_formula
     *
     * @param string $priceFormula
     * @return References
     */
    public function setPriceFormula(string $priceFormula):References
    {
        $this->price_formula = $priceFormula;

        return $this;
    }

    /**
     * Get price_formula
     *
     * @return string 
     */
    public function getPriceFormula():string
    {
        return $this->price_formula;
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
