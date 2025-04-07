import { useMutation, useQuery } from '@tanstack/react-query';

export const useApiQuery = (key, fn, options) =>
    useQuery({ queryKey: key, queryFn: fn, ...options });

export const useApiMutation = (fn, success, error, options) => {
    return useMutation({
        mutationFn: fn,
        onSuccess: (data) => {
            console.log('api mutation success');
            success && success(data);
        },
        onError: error,
        ...options,
    });
};
