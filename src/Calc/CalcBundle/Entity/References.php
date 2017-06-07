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
        'length_koef',
        'length_degree',
        'delta_length',
        'width_koef',
        'width_degree',
        'delta_width',
        'height_koef',
        'height_degree',
        'delta_height'
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
     * @ORM\Column(type="float")
     */
    protected $length_koef = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $length_degree = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $delta_length = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $width_koef = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $width_degree = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $delta_width = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $height_koef = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $height_degree = 0;

    /**
     * @ORM\Column(type="float")
     */
    protected $delta_height = 0;


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
     * Set length_koef
     *
     * @param length_koef
     * @return References
     */
    public function setLengthKoef(float $length_koef):References
    {
        $this->length_koef = $length_koef;

        return $this;
    }

    /**
     * Get length_koef
     *
     * @return float
     */
    public function getLengthKoef():float
    {
        return $this->length_koef;
    }

    /**
     * Set length_degree
     *
     * @param length_degree
     * @return References
     */
    public function setLengthDegree(float $length_degree):References
    {
        $this->length_degree = $length_degree;

        return $this;
    }

    /**
     * Get length_degree
     *
     * @return float
     */
    public function getLengthDegree():float
    {
        return $this->length_degree;
    }

    /**
     * Set delta_length
     *
     * @param delta_length
     * @return References
     */
    public function setDeltaLength(float $delta_length):References
    {
        $this->delta_length = $delta_length;

        return $this;
    }

    /**
     * Get delta_length
     *
     * @return float
     */
    public function getDeltaLength():float
    {
        return $this->delta_length;
    }

    /**
     * Set width_koef
     *
     * @param width_koef
     * @return References
     */
    public function setWidthKoef(float $width_koef):References
    {
        $this->width_koef = $width_koef;

        return $this;
    }

    /**
     * Get width_koef
     *
     * @return float
     */
    public function getWidthKoef():float
    {
        return $this->width_koef;
    }

    /**
     * Set width_degree
     *
     * @param width_degree
     * @return References
     */
    public function setWidthDegree(float $width_degree):References
    {
        $this->width_degree = $width_degree;

        return $this;
    }

    /**
     * Get width_degree
     *
     * @return float
     */
    public function getWidthDegree():float
    {
        return $this->width_degree;
    }

    /**
     * Set delta_width
     *
     * @param delta_width
     * @return References
     */
    public function setDeltaWidth(float $delta_width):References
    {
        $this->delta_width = $delta_width;

        return $this;
    }

    /**
     * Get delta_width
     *
     * @return float
     */
    public function getDeltaWidth():float
    {
        return $this->delta_width;
    }

    /**
     * Set height_koef
     *
     * @param height_koef
     * @return References
     */
    public function setHeightKoef(float $height_koef):References
    {
        $this->height_koef = $height_koef;

        return $this;
    }

    /**
     * Get height_koef
     *
     * @return float
     */
    public function getHeightKoef():float
    {
        return $this->height_koef;
    }

    /**
     * Set height_degree
     *
     * @param height_degree
     * @return References
     */
    public function setHeightDegree(float $height_degree):References
    {
        $this->height_degree = $height_degree;

        return $this;
    }

    /**
     * Get height_degree
     *
     * @return float
     */
    public function getHeightDegree():float
    {
        return $this->height_degree;
    }

    /**
     * Set delta_height
     *
     * @param delta_height
     * @return References
     */
    public function setDeltaHeight(float $delta_height):References
    {
        $this->delta_height = $delta_height;

        return $this;
    }

    /**
     * Get delta_height
     *
     * @return float
     */
    public function getDeltaHeight():float
    {
        return $this->delta_height;
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
