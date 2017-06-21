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
    protected $unit = 'м';

    /**
     * @ORM\Column(type="string")
     */
    protected $currency = 'р';

    /**
     * @ORM\Column(type="string")
     */
    protected $price_formula = ":count * :length";

    /**
     * @ORM\Column(type="string")
     */
    protected $amount_formula = ":width * :length";


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
     * Set price_formula
     *
     * @param string $price_formula
     * @return References
     */
    public function setPriceFormula(string $price_formula):References
    {
        $this->price_formula = $price_formula;

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
     * Set amount_formula
     *
     * @param string $amount_formula
     * @return References
     */
    public function setAmountFormula(string $amount_formula):References
    {
        $this->amount_formula = $amount_formula;

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
