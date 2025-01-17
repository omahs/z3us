import { useNoneSharedStore } from '@src/hooks/use-store'
import { useTransaction } from '@src/hooks/use-transaction'
import { buildAmount } from '@src/utils/radix'
import { ExtendedActionType } from '@src/types'
import { parseAccountAddress, parseResourceIdentifier } from '@src/services/radix/serializer'

export const useTokenBurn = () => {
	const { buildTransactionFromActions } = useTransaction()
	const { address } = useNoneSharedStore(state => ({
		address: state.getCurrentAddressAction(),
	}))

	const burn = async (rri: string, amount: string) =>
		buildTransactionFromActions([
			{
				type: ExtendedActionType.BURN_TOKENS,
				from_account: parseAccountAddress(address),
				amount: buildAmount(amount),
				rri: parseResourceIdentifier(rri),
			},
		])

	return burn
}
