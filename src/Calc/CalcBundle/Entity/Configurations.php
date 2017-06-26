<?php

namespace Calc\CalcBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="configurations")
 */
class Configurations
{
    const FIELDS = [
        'id',
        'name',
        'label',
        'elements'
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
    protected $elements = '[]';

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
     * @return Configurations
     */
    public function setName(string $name):Configurations
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
     * @return Configurations
     */
    public function setLabel(string $label):Configurations
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
     * Set elements
     *
     * @param array $elements
     * @return Configurations
     */
    public function setElements(array $elements):Configurations
    {
        $this->elements = json_encode($elements);

        return $this;
    }

    /**
     * Get elements
     *
     * @return array
     */
    public function getElements():array
    {
        return json_decode($this->elements);
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