pragma solidity ^0.4.3;

library ArrayUtils {
	
	/*
	 * remove
	 * @description: 
	 * @param: 
	 * @return: 
	 */
    function remove(uint index, adrress[] array)  returns(adrress[]) {
        if (index >= array.length) return;

        for (uint i = index; i<array.length-1; i++){
            array[i] = array[i+1];
        }
        delete array[array.length-1];
        array.length--;
        return array;
    }
}


