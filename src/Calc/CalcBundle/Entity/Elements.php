<?php

namespace Calc\CalcBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="elements")
 */
class Elements
{
    const FIELDS = [
        'id',
        'name',
        'label',
        'options'
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
     * @ORM\Column(type="string")
     */
    protected $label;

    /**
     * @ORM\Column(type="string")
     */
    protected $options = '["required": [], "additional": []]';

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
     * Set label
     *
     * @param string $label
     * @return References
     */
    public function setLabel(string $label):References
    {
        $this->label = $label;

        return $this;
    }

    /**
     * Get label
     *
     * @return string
     */
    public function getLabel():string
    {
        return $this->label;
    }

    /**
     * Set options
     *
     * @param array $options
     * @return References
     */
    public function setOptions(array $options):References
    {
        $this->options = json_encode($options);

        return $this;
    }

    /**
     * Get options
     *
     * @return \stdClass
     */
    public function getOptions():\stdClass
    {
        return json_decode($this->options);
    }

    public function getFields(array $fields = self::FIELDS):array
    {
        $result = [];
        foreach($fields as $value) {
            $getter = "get".ucfirst($value);
            if (method_exists($this, $getter)) {
                $result[$value] = $this->$getter();
            }
        }

        return $result;
    }
}